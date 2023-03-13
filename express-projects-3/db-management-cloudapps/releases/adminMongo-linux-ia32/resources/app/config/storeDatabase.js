var mongoose = require('mongoose');
var uuid = require('uuid');
var validator = require('mongoose-unique-validator');

var extraProperty = {
      "Id": {
            "type": "string",
            "default":uuid.v4,
            "unique":true
        },
			"email": {
				     	"type": "string",
				     	"unique": true
            },
            "name":{
              "type":"string"
            }
			}

var categorySchema = mongoose.Schema({extraProperty},{timestamps:true,versionKey: false,});

    categorySchema.plugin(validator);
    var Category = mongoose.model('Category', categorySchema);

    module.exports = Category;
