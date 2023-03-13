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
        "Adres": {
            "type": "string"
        },
        "Dinsdag": {
            "type": "string"
        },
        "Donderdag": {
            "type": "string"
        },
        "Email": {
            "type": "string"
        },
        "Kantoornaam": {
            "type": "string"
        },
        "Lat_instelling": {
            "type": "string"
        },
        "Long_instelling": {
            "type": "string"
        },
        "Maandag": {
            "type": "string"
        },
        "OverOnsBedrijf": {
            "type": "string"
        },
        "Plaats": {
            "type": "string"
        },
        "Postcode": {
            "type": "string"
        },
        "Telefoonnummer": {
            "type": "string"
        },
        "Vrijdag": {
            "type": "string"
        },
        "Woensdag": {
            "type": "string"
        },
        "Zaterdag": {
            "type": "string"
        },
        "Zondag": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'kantoor');
    schema.plugin(validator);
    const kantoor = mongoose.model('kantoor', schema);

    module.exports = {kantoor, schema};
