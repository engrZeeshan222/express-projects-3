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
        "link": {
            "type": "string"
        },
        "category": {
            "type": "string"
        },
        "icon": {
            "type": "string"
        },
        "list_item_naam": {
            "type": "string"
        },
        "volgorde_nummer": {
            "type": "number"
        },
        "hide_listitem": {
            "type": "boolean",
            "default": false
        },
        "parent": {
            "type": "string"
        },
        "video_type": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'videos');
    schema.plugin(validator);
    const videos = mongoose.model('videos', schema);

    module.exports = {videos, schema};
