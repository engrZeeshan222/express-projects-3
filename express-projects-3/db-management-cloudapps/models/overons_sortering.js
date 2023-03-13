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
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'overons_sortering');
    schema.plugin(validator);
    const overons_sortering = mongoose.model('overons_sortering', schema);

    module.exports = {overons_sortering, schema};
