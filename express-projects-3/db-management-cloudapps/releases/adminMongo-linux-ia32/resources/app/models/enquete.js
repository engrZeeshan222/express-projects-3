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
        "comment": {
            "type": "string"
        },
        "company": {
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
        "q1": {
            "type": "string"
        },
        "q2": {
            "type": "string"
        },
        "q3": {
            "type": "string"
        },
        "q4": {
            "type": "string"
        },
        "q5": {
            "type": "string"
        },
        "q6": {
            "type": "string"
        },
        "q7": {
            "type": "string"
        }

    },
    {
      versionKey: false
    });

    schema.set('collection', 'enquete');
    schema.plugin(validator);
    const enquete = mongoose.model('enquete', schema);

    module.exports = {enquete, schema};
