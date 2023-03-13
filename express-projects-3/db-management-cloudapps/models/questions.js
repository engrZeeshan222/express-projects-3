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
        "topic": {
            "type": "string"
        },
        "question": {
            "type": "string"
        },
        "phone": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "IsNew": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "emailNotification": {
            "type": "string"
        },
        "deviceid": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'questions');
    schema.plugin(validator);
    const questions = mongoose.model('questions', schema);

    module.exports = {questions, schema};
