const io = require('socket.io-client');
const http = require('http');
const sch = require('node-schedule');
const RIDE_SHARING_SERVICE_ROOT_PATH = '/ride-sharing-service/api/'
const RATING_SERVICE_ROOT_PATH = '/rating-service/api/';

let location = 'ctg';
let socket = io.connect(`http://communication.${location}.com:5001/communication`);

socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('matched', (data) => {

    console.log(JSON.parse(data));
    let rating = randomNumber(0,5);
    setRating(rating)

});

sch.scheduleJob('*/1 * * * * *', function () {
    sendRiderReq();
    sendDriverReq();
});

function randomNumber(min, max) {
    return (Math.random().toFixed(2) * (max - min) + min);
}

function sendRiderReq() {

    let riderReq = http.request(
        {
            host: `server.${location}.com`,
            path: RIDE_SHARING_SERVICE_ROOT_PATH + '/rider',
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

    let name = randomNumber(200, 900);
    let CorX = randomNumber(0, 20);
    let CorY = randomNumber(0, 20);
    let DesX = randomNumber(50, 100);
    let DesY = randomNumber(50, 100);

    riderReq.write(
        JSON.stringify({
            name: 'Client_' + name,
            CorX: CorX,
            CorY: CorY,
            DeX: DesX,
            DesY: DesY,
        })
    );

    riderReq.end();
}

function sendDriverReq() {

    let driverReq = http.request(
        {
            host: `server.${location}.com`,
            path: RIDE_SHARING_SERVICE_ROOT_PATH + '/driver',
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

    let name = randomNumber(200, 900);
    let carNumber = randomNumber(1000, 2000);
    let CorX = randomNumber(0, 20);
    let CorY = randomNumber(0, 20);

    driverReq.write(
        JSON.stringify({
            name: 'Driver_' + name,
            carNumber: 'Dhaka_' + carNumber,
            CorX: CorX,
            CorY: CorY,
        })
    );

    driverReq.end();
}

function setRating(rating) {

    let ratingRequest = http.request(
        {
            host: `server.${location}.com`,
            path: RATING_SERVICE_ROOT_PATH + '/rating',
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

    ratingRequest.write(
        JSON.stringify({
            rating: rating
        })
    );

    ratingRequest.end();
}
