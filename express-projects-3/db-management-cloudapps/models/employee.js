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
        "fax": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "background_details": {
            "type": "string"
        },
        "image_url": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "streetAddr1": {
            "type": "string"
        },
        "streetAddr2": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'employee');
    schema.plugin(validator);
    const employee = mongoose.model('employee', schema);

    module.exports = {employee, schema};
