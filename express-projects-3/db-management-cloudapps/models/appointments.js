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
        "CreatedAt": {
            type: Date,
            "default": Date.now()
        },
        "ModifiedAt": {
            type: Date,
            "default": Date.now()
        },
        "CreatedBy": {
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
        "place": {
            "type": "string"
        },
        "alreadyCustomer": {
            "type": "string"
        },
        "comment": {
            "type": "string"
        },
        "company": {
            "type": "string"
        },
        "date": {
            "type": "date"
        },"topic": {
            "type": "string"
        },
        "deviceid": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "emailNotification": {
            "type": "string"
        },
        "IsNew": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "phone": {
            "type": "string"
        },
        "time": {
            "type": "string"
        }


    },
    {
      versionKey: false
    });

    schema.set('collection', 'appointments');
    schema.plugin(validator);
    const appointments = mongoose.model('appointments', schema);

    module.exports = {appointments, schema};
