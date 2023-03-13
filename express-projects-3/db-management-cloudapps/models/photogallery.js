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
        "Image_url": {
            "type": "string"
        },
        "Description": {
            "type": "string"
        },
        "id": {
            "type": "string"
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
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'photogallery');
    schema.plugin(validator);
    const photogallery = mongoose.model('photogallery', schema);

    module.exports = {photogallery, schema};
