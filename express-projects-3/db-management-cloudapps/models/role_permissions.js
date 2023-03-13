var mongoose = require('mongoose');
var config = require('../config/database');
var uuid = require('uuid');
var validator = require('mongoose-unique-validator');

var schema = mongoose.Schema({
     "Id": {
        "type": "string",
        "default":uuid.v4,
        "unique":true
    },
    "RoleId": {
      "type": "string"
    },
    "permission":{
      "type":"object",
      "default": {}
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
      }
},
{
  versionKey: false
});

schema.set('collection', 'role_permissions');
schema.plugin(validator);
const role_permissions = mongoose.model('role_permissions', schema);

module.exports = {role_permissions, schema};
