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
        }, "CreatedBy": {
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
        "leavesTo": {
            "type": "date"
        },
        "leavesFrom": {
            "type": "date"
        },
        "employeeName": {
            "type": "string"
        },
        "subject": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "totalClients": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "description_2": {
            "type": "string"
        }

        
    },
    {
      versionKey: false
    });

    schema.set('collection', 'leave');
    schema.plugin(validator);
    const leave = mongoose.model('leave', schema);

    module.exports = {leave, schema};
