const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());

const ROOT_PATH = '/communication-service/api/';
const PORT = 3001;
let connectedUser;
//start the server in port 3001
http.listen(PORT, () => {
    console.log('Communication service is started at port ' + PORT);
});

io.of('communication').on('connection', (socket) => {
    connectedUser = socket;
    console.log("User connected: " + socket.id);
});
// receive data from ride sharing .js and emit it to client
app.post(ROOT_PATH + '/matching', async (req, res) => {
    if (connectedUser) {
        connectedUser.emit("matched", JSON.stringify(
                {
                    mathedData: req.body.clientInfo
                }
            )
        );
    }
});
