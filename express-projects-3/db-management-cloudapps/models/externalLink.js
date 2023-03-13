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
        "list_item_name": {
            "type": "string"
        },
        "hideListItem": {
            "type": "boolean"
        },
        "link": {
            "type": "string"
        },
        "icon": {
            "type": "string"
        },
        "parameters": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'externalLink');
    schema.plugin(validator);
    const externalLink = mongoose.model('externalLink', schema);

    module.exports = {externalLink, schema};
