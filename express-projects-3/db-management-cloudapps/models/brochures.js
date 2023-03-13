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
        "image_url": {
            "type": "string"
        },
        "id": {
            "type": "string"
        },
        "File_name_db": {
            "type": "string"
        },
        "Description": {
            "type": "string"
        },
        "type_pdf_document": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'brochures');
    schema.plugin(validator);
    const brochures = mongoose.model('brochures', schema);

    module.exports = {brochures, schema};
