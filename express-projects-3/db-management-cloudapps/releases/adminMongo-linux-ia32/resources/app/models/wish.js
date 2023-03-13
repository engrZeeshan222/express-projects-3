var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');
var validator = require('mongoose-unique-validator');

let schema = mongoose.Schema({
        "Id": {
            "type": "string",
            "default": uuid.v4,
            "unique": true
        },
        "CreatedAt": {
            "type": "date",
            "default": Date.now()
        },
        "ModifiedAt": {
            "type": "date",
            "default": Date.now()
        }, "CreatedBy": {
            "type": "string",
            "default": "00000000-0000-0000-0000-000000000000"
        },
        "ModifiedBy": {
            "type": "string",
            "default": "00000000-0000-0000-0000-000000000000"
        },
        "Owner": {
            "type": "string",
            "default": "00000000-0000-0000-0000-000000000000"
        },
        "sequenceNumber": {
            "type": "number"
        },
        "name": {
            "type": "string"
        },
        "id": {
            "type": "number"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'wish');
    schema.plugin(validator);
    const wish = mongoose.model('wish', schema);

    module.exports = {wish, schema};
