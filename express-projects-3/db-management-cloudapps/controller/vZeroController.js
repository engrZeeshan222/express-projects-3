const RolePermission = require('../models/role_permissions');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Role = require('../models/roles');
var async1 = require('async');
var uuid = require('uuid/v4');
var validator = require('mongoose-unique-validator');
var fs = require("fs");
var EmailService = require('../service/emailService');
require('events').EventEmitter.prototype._maxListeners = 100;
//
var MongoClient = require('mongodb').MongoClient;

var log4js = require('log4js');
log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'logs.log' }
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' }
  }
});
var logger = log4js.getLogger();
logger.level = 'debug';

module.exports = {
  createRecord,
  getAllRecord,
  getRecordrById,
  updateRecord,
  deleteRecord,
  createCollectionDynamic,
  deleteCollectionDynamic,
  deletefieldsFromCollection,
  deleteAllDataFromCollection,
  updateRecordById
};

function createRecord(req, res, next) {
  const database = req.database;
  const conn = req.connection;
  req.body.CreatedBy = req.user_id;
  req.body.ModifiedBy = req.user_id;
  req.body.Owner = req.user_id;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;
  var model = {};
  // console.log(req.body);

  if (req.body.Result) {
    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      if (mongoConnErr) {
        return res.status(500).send({ error: { statusCode: 500, message: mongoErr } });
      } else {
        // remove the collection's data first
        db.collection(req.model).remove({}, function (err, user) {
          if (err) {
            logger.error(err);
            console.log('---error in removing the collection---');
          } else {
            console.log('---removed the collection---');
          }
        });

        async1.forEach(req.body.Result, function (record, callback) {
          if (req.model == 'app_user') {
            if (!record.rubriek) {
              record.rubriek = 'Leeg';
            }
          }
          db.collection(req.model).findOneAndUpdate({ Id: record.Id }, record, { upsert: true }, function (mongoErr, createdUser) {
            if (mongoErr) {
              logger.error(mongoErr);
            }
            callback();
          })

        }, function (err) {
          if (err) {
            logger.error(err);
            db.close();
            return res.status(500).send({ error: { statusCode: 500, message: err } });
          }
          db.close();
          res.data = { statusCode: 200, message: req.model + ' successfully imported' };
          return next();
        })
      }

    })

  } else {
    try {
      if (req.model == 'app_user') {
        if (!req.body.rubriek) {
          req.body.rubriek = 'Leeg';
        }
      }
      req.body.Id = uuid();
      req.body.CreatedAt = new Date();
      req.body.ModifiedAt = new Date();
      MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
        db.collection(req.model).insert(req.body, function (mongoErr, createdUser) {
          if (mongoErr) {
            if (!res.headersSent) {
              db.close();
              return res.status(500).send({ error: { statusCode: 500, message: mongoErr } });
            }
          }
          try {
            EmailService.sendEmail(createdUser.ops[0], req.model, conn); // send mail
          } catch (e) {
            logger.error(e);
            console.log("Got Error while sending mail:");
          }
          res.data = {
            "Id": createdUser.ops[0].Id,
            "CreatedAt": new Date()
          };
          db.close();
          return next();
        })
      })

    } catch (e) {
      logger.error(e);
      console.log(e);
      return res.status(500).send({ error: { statusCode: 500, message: 'Internal server error' } });
    }
  }

}

function getAllRecord(req, res, next) {
  var url = require('url');
  //console.log(JSON.stringify(req.headers));
  const database = req.database;
  // const conn = req.connection;
  // var owner = req.user_id;
  // var permissionObj = req.permissionColl;
  var filter = {};
  var sort = {};
  //  v2 template
  var query = url.parse(req.url, true).query;
  if (query && query.filter) {
    //  console.log(query.filter);
    filter = JSON.parse(query.filter);
    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
        if (err) {
          logger.error(err);
          db.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        } else {
          //console.log(result.length)
          res.data = [];
          res.data = result;
          //console.log("below: Elsemain1");
          // console.log(res.data);
          db.close();
          next();
          process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        }
      })
    })
  }
  //end v2 template
  else {
    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      try {
        filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
      } catch (e) {
        logger.error(e);
        filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
        filter = JSON.parse(filter);
      }
    }
    if (req.headers['x-everlive-sort'] && decodeURIComponent(req.headers['x-everlive-sort'])) {
      sort = JSON.parse(decodeURIComponent(req.headers['x-everlive-sort']));
    }

    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
        if (err) {
          logger.error(err);
          db.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        } else {
          res.data = result;
          db.close();
          next();
          process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        }
      })
    })

  }


}

function getRecordrById(req, res, next) {
  const database = req.database;
  var requestedId = req.params.id;
  MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
    db.collection(req.model).findOne({ Id: requestedId }, { '_id': 0 }, function (err, result) {
      if (err) {
        logger.error(err);
        db.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      } else {
        //console.log("below: ElsebyId and result");
        res.data = result;
        //console.log(res.data);
        db.close();
        next();
        process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
      }
    })
  })
}

function updateRecord(req, res, next) {
  const database = req.database;
  if (req.body.Id) {
    // for restapicall
    if (req.model == 'app_user') {
      if (req.body) {
        if (!req.body.rubriek) {
          req.body.rubriek = 'Leeg';
        }
      }
    }
    // req.body.ModifiedBy = req.user_id;
    req.body.ModifiedAt = new Date();
    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      db.collection(req.model).update({ Id: req.body.Id }, { $set: req.body }, function (err, result) {
        if (err) {
          logger.error(err);
          db.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        res.data = {
          "ModifiedAt": new Date(),
          "Result": result.result.ok
        };
        db.close();
        next();
        process.on('unhandledRejection', up => { });
      })
    })
  } else if (req.body.$set) {
    // for appAPI call
    if (req.model == 'app_user') {
      if (req.body.$set) {
        if (!req.body.$set.rubriek) {
          req.body.$set.rubriek = 'Leeg';
        }
      }
    }
    // req.body.$set.ModifiedBy = req.user_id;
    req.body.$set.ModifiedAt = new Date();
    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      db.collection(req.model).update({ Id: req.body.$set.Id }, req.body, function (err, result) {
        if (err) {
          logger.error(err);
          db.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        res.data = {
          "ModifiedAt": new Date(),
          "Result": result.result.ok
        };
        db.close();
        next();
        process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
      })
    })

  } else {
    return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
  }


}

function updateRecordById(req, res, next) {

  const database = req.database;

  if (req.params.id) {
    // for restapicall
    if (req.model == 'app_user') {
      if (req.body) {
        if (!req.body.rubriek) {
          req.body.rubriek = 'Leeg';
        }
      }
    }
    //req.body.ModifiedBy = req.user_id;
    req.body.ModifiedAt = new Date();
    MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
      db.collection(req.model).update({ Id: req.params.id }, { $set: req.body }, function (err, result) {
        if (err) {
          logger.error(err);
          db.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        res.data = {
          "ModifiedAt": new Date(),
          "Result": result.result.ok
        };
        db.close();
        next();
        process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
      })
    })

  } else {
    return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
  }
}

function deleteRecord(req, res, next) {
  const database = req.database;
  // const conn = req.connection;
  // const owner = req.user_id;
  // var roleName = req.roleName;
  // var methodType = req.methodType;
  // var permissionObj = req.permissionColl;
  var model = {};
  MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
    db.collection(req.model).remove({ Id: req.params.id }, function (err, user) {
      if (err) {
        logger.error(err);
        db.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }

      if (user.result.n == 0) {
        db.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'Record successfully deleted' };
      db.close();
      return next();
      process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections to terminate the nodejs process
    })
  })
}

function createCollectionDynamic(req, res, next) {
  const conn = req.connection;
  if (req.body.modelName && req.body.schema) {
    conn.db.collection(req.body.modelName).findOne({}, function (err, found) {
      if (!found) {
        conn.db.createCollection(req.body.modelName, function (error, created) {
          if (error) {
            logger.error(error);
            conn.close();
            return res.status(500).send({ error: { statusCode: 500, message: "Collection not created" } });
          } else {
            //update permission object for newly created collection
            updatePermissionObject(conn, req.body.modelName);
            return res.status(200).send({ error: { statusCode: 200, message: "Collection created successfully" } });
          }
        })
      } else {
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: "Collection is already exist" } });
      }
    })
  } else {
    return res.status(422).send({ error: { statusCode: 422, message: "modelName and schema are required" } });
  }
}

function deleteCollectionDynamic(req, res, next) {
  const conn = req.connection;
  conn.db.dropCollection(req.body.modelName, function (error, result) {
    if (error) {
      logger.error(error);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: 'Collection not deleted,Something went wrong please try again later' } });
    }
    else if (result) {
      console.log(result);
      removePermissionObject(req.connection, req.body.modelName);
      return res.status(200).json({ 'msg': 'Collection successfully deleted', 'coll_name': req.body.modelName });
    } else {
      return res.status(200).json({ 'msg': 'Collection not deleted,please try again', 'coll_name': req.body.modelName });
    }
  })

}

function updatePermissionObject(conn, modelName) {
  //update permission object for newly created collection
  // var Role1 = conn.model('roles',RolePermission.schema);
  conn.db.collection('role_permissions').find({}).toArray(function (error, sRole) {
    if (error) {
      conn.close();
    }
    if (!sRole) {
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: "No role found,permission object is not updated" } });
    } else {
      sRole.forEach((record) => {
        record.permission[modelName] = { "read": true, "create": true, "update": true, "delete": true };
        var role_permissions3 = conn.model('role_permissions', RolePermission.schema);
        role_permissions3.update({ Id: record.Id }, { $set: record }, { upsert: true }, function (err, user) {
          if (err) {
            logger.error(err);

          }

        })

      })
    }
  })
}


function removePermissionObject(conn, modelName) {
  //remove permission for deleted collection
  var Role1 = conn.model('roles', RolePermission.schema);
  Role1.find({}, function (error, sRole) {
    if(error){
      conn.close();
    }
    if (!sRole) {
      logger.error("No role found,permission object is not updated");
     conn.close();
    } else {
      sRole.forEach((record) => {
        delete record.permission[modelName];
        var role_permissions3 = conn.model('role_permissions', RolePermission.schema);
        role_permissions3.update({ Id: record.Id }, { $set: record }, { upsert: true }, function (err, user) {
          if (err) {
            logger.error(err);

          }

        })

      })
    }
  })
}

function deletefieldsFromCollection(req, res, next) {
  // db.example.update({}, {$unset: {words:1}}, false, true); //for single record
  //db.example.update({}, {$unset: {words:1}} , {multi: true}); // for multi record
  const conn = req.connection;
  conn.db.collection(req.model).update({}, { $unset: req.body.properties }, { multi: true }, function (err, result) {
    if (err) {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: "Field not deleted, please try again later" } });
    } else if (result.result.nModified != 0) {
      console.log(result.result.nModified);
      conn.close();
      return res.status(200).json({ 'msg': 'Fields are deleted', 'coll_name': req.model });
    } else {
      conn.close();
      return res.status(200).json({ 'msg': 'Fields not found', 'coll_name': req.model });
    }
  })

}

function deleteAllDataFromCollection(req,res,next){
  const database = req.database;
  const conn = req.connection;
  var roleName   =   req.roleName;
  var permissionObj = req.permissionColl;
  var model = {};
// console.log(req.body);
    if (req.query.deleteAll) {
        MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
            db.collection(req.model).remove({}, function (err, user) {
                if (err) {
                    db.close();
                    return res.status(500).send({error: {statusCode: 500, message: err}});
                } else {
                    db.close();
                    return res.status(200).send({success: 'All documents has been deleted', statusCode: 200});

                }
            })
        })
    } else {
        return res.status(500).send({error: {statusCode: 500, message: 'Not deleted missing delete toggle'}});
    }
}
