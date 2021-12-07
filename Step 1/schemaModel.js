const mongooes = require('mongoose');

const schemaModel = new mongooes.Schema(
    {
        riderName: {
            type: String,
            require: true
        },

        driverName: {
            type: String,
            require: true,
        },

        rating: {
            type: Number,
            require: false,
            default: 0,
        }
    }
);

module.exports = mongooes.model('schemaModel', schemaModel);