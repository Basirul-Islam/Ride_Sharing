const mongooes = require('mongoose');
const schemaModel = require('./schema-model');

const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.json());

const ROOT_PATH = '/rating-service/api/';
const PORT = 8080;

http.listen(PORT, () => {
    console.log('Rating service is started at port ' + PORT);
});

mongooes.connect('mongodb://mongodb:27017/rating', {useNewUrlParser: true, useUnifiedTopology: true});

mongooes.connection.once('open', () => {

    console.log('MongoDB Connected');

}).on('error', (error) => {
    console.log('Faild to connect with MongoDB! error: ' + error);
});


app.post(ROOT_PATH + '/rating', async (req, res) => {
    await storeRating(req.body.rating);
});

async function storeRating(rating) {
    let mongoData = new schemaModel({rating});

    try {
        await mongoData.save();

    } catch (exception) {
        console.log(exception);
    }

    let data = await schemaModel.find();
    console.log(data);
}
