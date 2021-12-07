const mongooes = require('mongoose');

const schemaModel = new mongooes.Schema(
    {
        rating: {
            type: Number,
            require: true,
            default: 0,
        }
    }
);

module.exports = mongooes.model('schema-model', schemaModel);