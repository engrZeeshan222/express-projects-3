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
        "id": {
            "type": "number"
        },
        "description": {
            "type": "string"
        },
        "subject": {
            "type": "string"
        },
        "attachment": {
            "type": "string"
        },
        "attachment_2": {
            "type": "string"
        },
        "attachment_3": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "attachmentName": {
            "type": "string"
        },
        "attachment2Name": {
            "type": "string"
        },
        "attachment3Name": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'signaling');
    schema.plugin(validator);
    const signaling = mongoose.model('signaling', schema);

    module.exports = {signaling, schema};
