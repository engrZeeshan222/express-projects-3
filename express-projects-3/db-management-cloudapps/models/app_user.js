var mongoose = require('mongoose');
var config = require('../config/database');
var uuid = require('uuid');
var validator = require('mongoose-unique-validator');

var schema = mongoose.Schema({
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
        "phone": {
            "type": "string"
        },
        "BTW": {
            "type": "boolean",
            "default": false
        },
        "LoonBelasting": {
            "type": "boolean",
            "default": false
        },
        "customer": {
            "type": "boolean",
            "default": false
        },
        "contact": {
            "type": "string"
        },
        "company": {
            "type": "string"
        },
        "deviceID": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "erfbelasting": {
            "type": "boolean",
            "default": false
        },
        "erfbelastingDatum": {
            "type": "date"
        },
          "IsNew": {
            "type": "string"
        },
        "kw_ma_lh": {
            "type": "string"
        },
        "kw_ma": {
            "type": "string"
        },
        "newsletter": {
            "type": "boolean",
            "default": false
        },
        "push": {
            "type": "boolean",
            "default": false
        },
         "rechtsvorm": {
            "type": "string"
        },
        "rubriek": {
            "type": "object"
        },
          "salutation": {
            "type": "string"
        },
         "schenkbelasting": {
            "type": "boolean",
             "default": false
        },
        "schenkingsplan": {
            "type": "boolean",
            "default": false
        },
        "sector": {
            "type": "string"
        },
        "targetGroup": {
            "type": "string"
        },
        "totalEmployees": {
            "type": "string"
        },
        "customerNo": {
            "type": "string"
        },
        "place": {
            "type": "string"
        }
    },
    {
       versionKey: false
    });

schema.set('collection', 'app_user');
schema.plugin(validator);
const app_user = mongoose.model('app_user', schema);


module.exports = {app_user, schema};
