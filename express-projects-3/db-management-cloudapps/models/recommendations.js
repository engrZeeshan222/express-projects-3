var mongoose = require('mongoose');
var config = require('../config/database');
var uuid = require('uuid');
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
        "list_item_naam": {
            "type": "string"
        },
        "volgorde_nummer": {
            "type": "number"
        },
        "hide_listitem": {
            "type": "boolean"
        },
        "link": {
            "type": "string"
        },
        "category": {
            "type": "string"
        },
        "icon": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'recommendations');
    schema.plugin(validator);
    const recommendations = mongoose.model('recommendations', schema);

    module.exports = {recommendations, schema};
