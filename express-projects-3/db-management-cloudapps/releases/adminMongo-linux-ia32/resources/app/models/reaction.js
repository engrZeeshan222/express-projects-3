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
        "description": {
            "type": "string"
        },
        "createdBy": {
            "type": "string"
        },
        "attachment": {
            "type": "string"
        },
        "todoId": {
            "type": "string"
        },
        "signalingId": {
            "type": "string"
        },
        "leaveId": {
            "type": "string"
        },
        "improvementSuggestionId": {
            "type": "string"
        },
        "tempExtraworkId": {
            "type": "string"
        },
        "fixedExtraworkId": {
            "type": "string"
        },
        "type": {
            "type": "string"
        },
        "attachmentName": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'reaction');
    schema.plugin(validator);
    const reaction = mongoose.model('reaction', schema);

    module.exports = {reaction, schema};
