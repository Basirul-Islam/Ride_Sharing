const express = require('express');
const sch = require('node-schedule');
const app = express();
const http = require('http').createServer(app);

app.use(express.json());

const ROOT_PATH = '/ride-sharing-service/api/';
const PORT = 8080;

http.listen(PORT, () => {
    console.log('Ride sharing service is started at port ' + PORT);
});

sch.scheduleJob('*/5 * * * * *', function () {
    getMinDistance();
});

let riders = [];
let drivers = [];

app.post(ROOT_PATH + '/rider', async (req, res) => {
    riders.push(req);
});

app.post(ROOT_PATH + '/driver', async (req, res) => {
    drivers.push(req);
});

function getDistance(x1, y1, x2, y2) {
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;
    let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return (dist);
}

function getMinDistance() {

    while (riders.length != 0 || drivers.length != 0) {
        let rider = riders.shift();

        let riderCorX = rider.body.CorX;
        let riderCorY = rider.body.CorY;

        let minDistance = 100000;
        let selectedDriver;
        let selectedDriverIndex = -1;

        for (let i = 0; i < drivers.length; i++) {
            let driverCorX = drivers[i].body.CorX;
            let driverCorY = drivers[i].body.CorY;

            let distance = getDistance(riderCorX, riderCorY, driverCorX, driverCorY);

            if (distance < minDistance) {
                minDistance = distance;
                selectedDriver = drivers[i];
                selectedDriverIndex = i;
            }
        }

        if (selectedDriverIndex != -1)
            drivers.splice(selectedDriverIndex, 1);

        let clientInfo = 'Best Match: ' +
            rider.body.name + ' (' + rider.body.CorX.toFixed(2) + ", " + rider.body.CorY.toFixed(2) + ')' +
            ' and ' +
            selectedDriver.body.name + ' (' + selectedDriver.body.CorX.toFixed(2) + ", " + selectedDriver.body.CorY.toFixed(2) + ')' +
            ' Car Number: ' + selectedDriver.body.carNumber +
            ' Distance: ' +
            minDistance.toFixed(2) +
            ' km, Ride Fare: ' +
            (minDistance * 2.0).toFixed(2);

        drivers = drivers.filter(function (value, index, arr) {
            return value != selectedDriver.name;
        });

        console.log("Available Riders: " + riders.length);
        console.log("Available Drivers: " + drivers.length);
        sendMatchingRequestToCommunicationRoute(clientInfo);
    }

    console.log("Cache is empty!");
}

function sendMatchingRequestToCommunicationRoute(clientInfo) {

    const communicationHTTP = require('http');
    const COMMUNICATION_SERVICE_ROOT_PATH = '/communication-service/api/';

    let communicationReq = communicationHTTP.request(
        {
            host: 'communication-service',
            port: 5000,
            path: COMMUNICATION_SERVICE_ROOT_PATH+'/matching',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            },
        }, (res) => {
        }
    ).on("error", (err) => {
        console.log("Error: " + err.message);
    });

    communicationReq.write(
        JSON.stringify({
            clientInfo: clientInfo
        })
    );

    communicationReq.end();
}
