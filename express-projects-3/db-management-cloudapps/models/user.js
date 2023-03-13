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
    "Username": {
      "type": "string",
      "unique":true
    },
    "Role": {
        "type": "string",
        "required":true
    },
    "DisplayName": {
      "type": "string"
    },
    "PasswordSalt": {
      "type": "string"
    },
    "VerificationCode": {
      "type": "string"
    },
    "Identity": {
      "type": "object"
    },
    "Email": {
      "type": "string",
      "unique": true
    },
    "PlayerId": {
        "type": "string",
        "default": "00000000-0000-0000-0000-000000000000"
    },
    "IsVerified": {
      "type": "boolean",
       "default":false
    },
    "IdentityProvider": {
      "type": "string"
    },
    "Password": {
      "type": "string",
      "required": true
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
    "RollbaseUserId": {
        "type": "string",
        "default": "00000000-0000-0000-0000-000000000000"
    },
    "PasswordToken": {
      "type": "string",
      "default": "00000000-0000-0000-0000-000000000000"
  }
},
{
  versionKey: false
});

schema.set('collection', 'users');
schema.plugin(validator);

//const User = connection.model('User',userSchema);
const user = mongoose.model('user', schema);

module.exports = {user, schema};
