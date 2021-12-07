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
const PORT = 5002;
let connectedUser;

/*http.listen(PORT, () => {
    console.log('Communication service is started at port ' + PORT);
});
*/



http.listen(5001, () => {
    console.log(`Socket & Server Running on port: 5001`);
});

app.listen(5000, () => {
    console.log(`Server Running on port: 5000`);
});

io.of('communication').on('connection', (socket) => {
    connectedUser = socket;
    console.log("User connected: " + socket.id);
});

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
