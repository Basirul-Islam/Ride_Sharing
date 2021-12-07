const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,  {
    cors: {
        origin: '*'
    }
});

const sch = require('node-schedule');
const mongooes = require('mongoose');
const schemaModel = require('./schemaModel');

mongooes.connect('mongodb://localhost/rating', { useNewUrlParser: true, useUnifiedTopology: true });

mongooes.connection.once('open', ()=>{

    console.log('Connected MongoDB');

}).on('error', (error)=>{
    console.log('Faild to connect with MongoDB! error: ' + error);
});

var riders = [];
var drivers = [];

var numberOfClientReq = 0;

app.use(express.json());

io.of('communication').on('connection', (socket)=>{
    console.log("User connected: " + socket.id);
    const job = sch.scheduleJob('*/5 * * * * *', function(){
         getMinDistance(socket);
    });
});

app.post('/rider',async (req,res) => {
    riders.push(req);

});

app.post('/driver',async (req,res) => {
    drivers.push(req);
});

app.post('/rating',async (req,res) => {

    var riderName = req.body.riderName;
    var driverName = req.body.driverName;
    var rating = req.body.rating;

    var mongoData = new schemaModel({riderName, driverName, rating});

    try{
         await mongoData.save();

    }catch(exception){
        console.log(exception);
    }

    var data = await schemaModel.find();
    console.log(data);

});


function getDistance (x1, y1, x2, y2) {
    var deltaX = x1 - x2;
    var deltaY = y1 - y2;
    var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return (dist);
  };

function getMinDistance(socket){

    if(numberOfClientReq>5){
        numberOfClientReq = 0;
        riders = [];
        drivers = [];
        return;
    }

    if(riders.length == 0)
    {
        socket.emit('minDis', 'No match found!');
        return;
    }

    riders.forEach(rider => {
        var riderCorX = rider.body.CorX;
        var riderCorY = rider.body.CorY;

        var minDistance = 100000;
        var selectedDriver;
        selectedRider = rider;

        drivers.forEach(driver => {
            var driverCorX = driver.body.CorX;
            var driverCorY = driver.body.CorY;

            var distance = getDistance(riderCorX, riderCorY, driverCorX, driverCorY);

            if(distance < minDistance)
            {
                minDistance = distance;
                selectedDriver = driver;
            }
                
        });

        var clientInfo = 'Best Match: ' +
        selectedRider.body.name + ' (' + selectedRider.body.CorX.toFixed(2) + ", " + selectedRider.body.CorY.toFixed(2) + ')' +
       ' and ' +
       selectedDriver.body.name + ' (' + selectedDriver.body.CorX.toFixed(2) + ", " + selectedDriver.body.CorY.toFixed(2) + ')' +
       ' Car Number: ' + selectedDriver.body.carNumber +
       ' Distance: ' + 
       minDistance.toFixed(2) +
       ' km, Ride Fare: ' +
       (minDistance * 2.0).toFixed(2);

        socket.emit("minDis", JSON.stringify(
            {
                clientMatch: clientInfo + '',
                riderName: selectedRider.body.name,
                driverName: selectedDriver.body.name,
            }
        )
        );

        numberOfClientReq++;

    });
}

http.listen(3000,()=>{
    console.log('Server started and listening to port 3000...');
})