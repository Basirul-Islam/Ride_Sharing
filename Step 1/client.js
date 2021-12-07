const io = require('socket.io-client');
const http = require('http');
const sch = require('node-schedule');
const { deflateSync } = require('zlib');

let socket = io.connect('http://localhost:3000/communication');

const job = sch.scheduleJob('*/1 * * * * *', function(){
    sendRiderReq();
    sendDriverReq();
});

function randomNumber(min, max) {
    return (Math.random().toFixed(2) * (max - min) + min);
}

function sendRiderReq(){

    var riderReq = http.request(
        {
            host : 'localhost',
            port : 3000,
            path : '/rider',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
                    },
        }, (res) => {
            let data = '';

            resp.on('data', (chunk) => {
              data += chunk;
            });

            resp.on('end', () => {
              console.log(JSON.parse(data).explanation);
            });
        }
    ).on("error", (err) => {
        console.log("Error: " + err.message);
      });

    var name = randomNumber(200, 900);
    var CorX = randomNumber(0, 20);
    var CorY = randomNumber(0, 20);
    var DesX = randomNumber(50, 100);
    var DesY = randomNumber(50, 100);
// write func write content and send to server
    riderReq.write(
        JSON.stringify({
            name : 'Client_' + name,
            CorX : CorX,
            CorY : CorY,
            DeX : DesX,
            DesY : DesY,
        })
    );

    riderReq.end();
}

function sendDriverReq(){

    var driverReq = http.request(
        {
            host : 'localhost',
            port : 3000,
            path : '/driver',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
                    },
        }, (res) => {
            res.on('error', function(thisError){
            });
        }
    );

    var name = randomNumber(200, 900);
    var carNumber = randomNumber(1000, 2000);
    var CorX = randomNumber(0, 20);
    var CorY = randomNumber(0, 20);

    driverReq.write(
        JSON.stringify({
            name : 'Driver_' + name,
            carNumber : 'Dhaka_' + carNumber,
            CorX : CorX,
            CorY : CorY,
        })
    );

    driverReq.end();
}

function setRating(riderName, driverName){

    var ratingReq = http.request(
        {
            host : 'localhost',
            port : 3000,
            path : '/rating',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
                    },
        }, (res) => {
            res.on('error', function(thisError){
            });
        }
    );

    var rating = parseInt(randomNumber(0,5));

    ratingReq.write(
        JSON.stringify({
            riderName : riderName,
            driverName : driverName,
            rating: rating
        })
    );

    ratingReq.end();

}

socket.on('minDis',(data)=>{
    console.log('\n\n\n');

    var info = JSON.parse(data);

    console.log(info.clientMatch);

    var riderName = info.riderName;
    var driverName = info.driverName;
    
    setRating(riderName, driverName);
});
