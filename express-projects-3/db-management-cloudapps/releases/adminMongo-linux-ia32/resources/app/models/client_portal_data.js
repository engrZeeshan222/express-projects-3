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
        "device_id": {
            "type": "string"
        },
        "enable_pdf": {
            "type": "boolean",
            "default": false
        },
        "selected": {
            "type": "string"
        },
        "send_pdf": {
            "type": "boolean",
            "default": false
        },
        "client_info": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'client_portal_data');

    schema.plugin(validator);
    const client_portal_data = mongoose.model('client_portal_data', schema);

    module.exports = {client_portal_data, schema};
