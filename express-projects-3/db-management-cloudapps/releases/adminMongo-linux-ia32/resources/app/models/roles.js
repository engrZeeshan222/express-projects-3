var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');
var validator = require('mongoose-unique-validator');

var schema = mongoose.Schema({
     "Id": {
        "type": "string",
        "default":uuid.v4,
        "unique":true
    },
    "Name": {
      "type": "string",
      "default": "app_user",
      "unique":true
    },
    "CreatedAt":{
      "type": "date",
      "default": Date.now()
    },
    "ModifiedAt":{
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

schema.set('collection', 'roles');
schema.plugin(validator);

//const User = connection.model('User',userSchema);
const role = mongoose.model('role', schema);

module.exports = {role, schema};
