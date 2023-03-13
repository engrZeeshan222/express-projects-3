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
        "algemeneemail": {
            "type": "string"
        },
        "algemenetelefoonnummer": {
            "type": "string"
        },
        "chat": {
            "type": "string"
        },
        "customerNo": {
            "type": "string"
        },
        "emailnotification": {
            "type": "string"
        },
        "klantbezoekadres": {
            "type": "string"
        },
        "klantbezoekplaats": {
            "type": "string"
        },
        "klantbezoekpostcode": {
            "type": "string"
        },
        "klantnaam": {
            "type": "string"
        },
        "klantplaats": {
            "type": "string"
        },
        "klantpostcode": {
            "type": "string"
        },
        "klantstraat": {
            "type": "string"
        },
        "klantwebsite": {
            "type": "string"
        },
        "openingstijden": {
            "type": "string"
        },
        "overonsbedrijf": {
            "type": "string"
        },
        "place": {
            "type": "string"
        }

  },
  {
    versionKey: false
  });

    schema.set('collection', 'AppSettings');
    schema.plugin(validator);
    const AppSettings = mongoose.model('AppSettings', schema);

    module.exports = {AppSettings, schema};
