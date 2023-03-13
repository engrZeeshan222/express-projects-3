var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');
var validator = require('mongoose-unique-validator');

let schema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
          "unique":true
    },
  user_id:{
        type:String
    },
  token:{
        type:String
    }
  },
  {
    timestamps:true,versionKey: false,
  });

  schema.plugin(validator);
  const userToken = mongoose.model('userToken', schema);

  module.exports = {
      userToken,
      schema
  };
