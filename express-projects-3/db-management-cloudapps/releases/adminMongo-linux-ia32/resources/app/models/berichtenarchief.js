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
        "webpagina": {
            "type": "string"
        },
        "rechtsvorm": {
            "type": "string"
        },
        "doelgroep": {
            "type": "string"
        },
        "bericht": {
            "type": "string"
        },
        "aantalmedewerkers": {
            "type": "string"
        }

    },
    {
      versionKey: false
    });

    schema.set('collection', 'berichtenarchief');
    schema.plugin(validator);
    const berichtenarchief = mongoose.model('berichtenarchief', schema);

    module.exports = {berichtenarchief, schema};
