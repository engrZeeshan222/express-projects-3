var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');
var validator = require('mongoose-unique-validator');

let categorySchema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
        "unique":true
    },
    category_name: {
          type: String
      }
       },
    {
      timestamps:true,versionKey: false,
    });

    categorySchema.plugin(validator);
    const Category = mongoose.model('Category', categorySchema);

    module.exports = Category;
