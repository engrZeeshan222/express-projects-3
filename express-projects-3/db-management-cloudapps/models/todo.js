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
        "id": {
            "type": "number"
        },
        "description": {
            "type": "string"
        },
        "todoSubject": {
            "type": "string"
        },
        "attachment": {
            "type": "string"
        },
        "attachment_2": {
            "type": "string"
        },
        "attachment_3": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "attachmentName": {
            "type": "string"
        },
        "attachment2Name": {
            "type": "string"
        },
        "attachment3Name": {
            "type": "string"
        },
        "department": {
            "type": "string"
        },
        "createdBy": {
            "type": "string"
        },
        "employee": {
            "type": "string"
        },
        "taskType": {
            "type": "string"
        },
        "dueDate": {
            "type": "string"
        },
        "assignedTo": {
            "type": "string"
        }
    },
    {
      versionKey: false
    });

    schema.set('collection', 'todo');
    schema.plugin(validator);
    const todo = mongoose.model('todo', schema);

    module.exports = {todo, schema};
