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
        "status": {
            "type": "string"
        },
        "energielabel":{
          "type":"string"
        },
        "ligging": {
            "type": "string"
        },
        "huur": {
            "type": "boolean",
            "default":false
        },
        "koop": {
            "type": "boolean",
            "default":true
        },
        "omschrijving": {
            "type": "string"
        },
        "tuin": {
            "type": "string"
        },
        "coordinates_1": {
            "type": "string"
        },
        "coordinates_2": {
            "type": "string"
        },
        "identificatie": {
            "type": "string"
        },
        "perceeloppervlakte": {
            "type": "string"
        },
        "bouwjaar": {
            "type": "string"
        },
        "woonruimte": {
            "type": "string"
        },
        "straat": {
            "type": "string"
        },
        "kamers": {
            "type": "string"
        },
        "woonoppervlakte": {
            "type": "string"
        },
        "type_soort": {
            "type": "string"
        },
        "stad": {
            "type": "string"
        },
        "garage": {
            "type": "string"
        },
        "media": {
            "type": "string"
        },
        "prijs": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'woning');
    schema.plugin(validator);
    const woning = mongoose.model('woning', schema);

    module.exports = {woning, schema};
