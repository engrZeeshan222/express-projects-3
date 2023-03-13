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
        "Username": {
            "type": "string"
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
        "icon": {
            "type": "string"
        },
        "link": {
            "type": "string"
        },
        "category": {
            "type": "string"
        },
        "list_item_naam": {
            "type": "string"
        },
        "volgorde_nummer": {
            "type": "string"
        },
        "hide_listitem": {
            "type": "boolean",
            "default": false
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'logins');
    schema.plugin(validator);
    const logins = mongoose.model('logins', schema);

    module.exports = {logins, schema};
