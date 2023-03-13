var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');
var validator = require('mongoose-unique-validator');

let schema = mongoose.Schema({
         "Id": {
            type: String,
            default: uuid.v4,
            "unique": true
        },
        "id": {
            type: String,
            "unique": true
        },   
},
    {
      versionKey: false
    });

    schema.set('collection', 'questionStatus');
    schema.plugin(validator);
    const questionStatus = mongoose.model('questionStatus', schema);

    module.exports = {questionStatus, schema};
