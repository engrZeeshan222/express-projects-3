const RolePermission = require("../models/role_permissions");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Role = require("../models/roles");
var async1 = require("async");
var uuid = require("uuid/v4");
var validator = require("mongoose-unique-validator");
var fs = require("fs");
var EmailService = require("../service/emailService");
var log4js = require("log4js");
log4js.configure({
  appenders: {
    everything: { type: "file", filename: "logs.log" },
  },
  categories: {
    default: { appenders: ["everything"], level: "debug" },
  },
});
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/telerik?authSource=admin";
var logger = log4js.getLogger();
logger.level = "debug";

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
  updateRecordById,
  getOwner,
  getNotifications,
  deleteNotifications,
  deleteAllDocsFromCollection,
};

function getOwner(req, res, next) {
  console.log(req.params);
  logger.info(req.params);
}

function createRecord(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  req.body.CreatedBy = req.user_id;
  req.body.ModifiedBy = req.user_id;
  // req.body.Owner = req.user_id;
  if (req.body.Owner) {
    req.body.Owner = req.body.Owner;
  } else {
    req.body.Owner = req.user_id;
  }
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;
  var model = {};

  // console.log(req.body);

  if (req.body.Result) {
    conn.db.collection(req.model).remove({}, function (err, user) {
      if (err) {
        logger.error(err);
        conn.close();
        return res
          .status(500)
          .send({ error: { statusCode: 500, message: err } });
      } else {
        console.log("---removed the collection---");
        logger.info("removed the collection");
      }
    });

    if (permissionObj == "true") {
      async1.forEach(
        req.body.Result,
        function (record, callback) {
          if (req.model == "app_user") {
            if (record && !record.rubriek) {
              record.rubriek = "Leeg";
            }
          }
          conn.db
            .collection(req.model)
            .findOneAndUpdate(
              { Id: record.Id },
              record,
              { upsert: true },
              function (error, createdUser) {
                if (error) {
                  logger.error(error);
                  if (!res.headersSent) {
                    conn.close();
                    //return res.status(500).send({error:{ statusCode:500,message:error}});
                  }
                }
                callback();
              }
            );
        },
        function (err) {
          if (err) {
            logger.error(err);
            conn.close();
            return res
              .status(500)
              .send({ error: { statusCode: 500, message: err } });
          }
          logger.info("successfully imported");
          res.data = {
            statusCode: 200,
            message: req.model + "successfully imported",
          };
          conn.close();
          return next();
        }
      );
    } else {
      conn.close();
      logger.error("Permission denied,You are not authorized user");
      return res.status(403).send({
        error: {
          statusCode: 403,
          message: "Permission denied,You are not authorized user",
        },
      });
    }
  } else {
    try {
      if (permissionObj == "true") {
        if (req.model == "app_user") {
          if (req.body && !req.body.rubriek) {
            req.body.rubriek = "Leeg";
          }
        }
        req.body.Id = uuid();
        req.body.CreatedAt = new Date();
        req.body.ModifiedAt = new Date();
        conn.db
          .collection(req.model)
          .insert(req.body, function (error3, createdUser) {
            if (error3) {
              if (!res.headersSent) {
                logger.error(error3);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: error3 } });
              }
            }

            try {
              EmailService.sendEmail(createdUser.ops[0], req.model, conn); // send mail
            } catch (e) {
              logger.error(e);
              logger.error("Got Error while sending mail:");
            }

            res.data = {
              Id: createdUser.ops[0].Id,
              CreatedAt: new Date(),
            };
            conn.close();
            return next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          });
      } else {
        conn.close();
        logger.error("Permission denied,You are not authorized user");
        return res.status(403).send({
          error: {
            statusCode: 403,
            message: "Permission denied,You are not authorized user",
          },
        });
      }
    } catch (e) {
      logger.error(e);
      console.log(e);
      conn.close();
      return res
        .status(500)
        .send({ error: { statusCode: 500, message: "Internal server error" } });
    }
  }
}

// commented by piyush 03-12-19

// function getAllRecord(req, res, next) {
//   // console.log(req);
//   var url = require('url');
//   const db = req.database;
//   const conn = req.connection;
//   var owner = req.user_id;
//   var permissionObj = req.permissionColl;
//   var filter = {};
//   var sort = {};

//   if (req.model == 'notifications') {
//     return res.status(500).send({ error: { statusCode: 401, message: 'Access Denied' } });
//   }
//   else {
//     if (permissionObj == 'true') {
//       //console.log("ohhh inside if");
//       //  v2 template
//       var query = url.parse(req.url, true).query;
//       if (query && query.filter) {
//         //console.log(query.filter);
//         filter = JSON.parse(query.filter);
//         conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
//           res.data = [];
//           res.data = result;
//           //console.log("below: Ifmaintrue");
//           //console.log(res.data);
//           conn.close();
//           next();
//           process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//         })
//       }
//       //end v2 template
//       else {
//         //console.log(req.headers['x-everlive-filter']);
//         //console.log(req.headers['x-everlive-sort']);
//         if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
//           try {
//             filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
//           } catch (e) {
//             logger.error(e);
//             filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
//             filter = JSON.parse(filter);
//           }
//           console.log(JSON.stringify(filter));
//         }
//         if (req.headers['x-everlive-sort'] && decodeURIComponent(req.headers['x-everlive-sort'])) {
//           sort = JSON.parse(decodeURIComponent(req.headers['x-everlive-sort']));
//         }

//         if (req.headers['x-everlive-skip'] && decodeURIComponent(req.headers['x-everlive-skip'])) {
//           var skip = JSON.parse(decodeURIComponent(req.headers['x-everlive-skip']));
//           skip = skip - 1;
//           conn.db.collection(req.model).find(filter, { '_id': 0 }).limit(20).skip(skip).sort(sort).toArray(function (err, result) {
//             if (err) {
//               logger.error(err);
//               conn.close();
//               return res.status(500).send({ error: { statusCode: 500, message: err } });
//             } else {
//               res.data = result;
//               // console.log("below: Elsemain1true");
//               // console.log(res.data);
//               conn.close();
//               next();
//               process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//             }
//           });

//         } else {
//           conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
//             if (err) {
//               logger.error(err);
//               conn.close();
//               return res.status(500).send({ error: { statusCode: 500, message: err } });
//             } else {
//               res.data = result;
//               // console.log("below: Elsemain1true");
//               // console.log(res.data);
//               conn.close();
//               next();
//               process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//             }
//           });
//         }

//       }

//     } else {
//       //  v2 template
//       var query = url.parse(req.url, true).query;
//       if (query && query.filter) {
//         //  console.log(query.filter);
//         filter = JSON.parse(query.filter);
//         filter.Owner = owner;
//         conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
//           if (err) {
//             logger.error(err);
//             conn.close();
//             return res.status(500).send({ error: { statusCode: 500, message: err } });
//           } else {
//             //console.log(result.length)
//             res.data = [];
//             res.data = result;
//             //console.log("below: Elsemain1");
//             // console.log(res.data);
//             conn.close();
//             next();
//             process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//           }
//         })
//       }
//       //end v2 template
//       else {
//         if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
//           try {
//             filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
//           } catch (e) {
//             logger.error(e);
//             filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
//             filter = JSON.parse(filter);
//           }
//         }
//         if (req.headers['x-everlive-sort'] && decodeURIComponent(req.headers['x-everlive-sort'])) {
//           sort = JSON.parse(decodeURIComponent(req.headers['x-everlive-sort']));
//         }
//         filter.Owner = owner;

//         if (req.headers['x-everlive-skip'] && decodeURIComponent(req.headers['x-everlive-skip'])) {
//           var skip = JSON.parse(decodeURIComponent(req.headers['x-everlive-skip']));
//           skip = skip - 1;

//           conn.db.collection(req.model).find(filter, { '_id': 0 }).limit(20).skip(skip).sort(sort).toArray(function (err, result) {
//             if (err) {
//               logger.error(err);
//               conn.close();
//               return res.status(500).send({ error: { statusCode: 500, message: err } });
//             } else {
//               //console.log(result.length)
//               // console.log("below: Elsemain2");
//               //console.log(res.data);
//               res.data = result;
//               conn.close();
//               next();
//               process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//             }
//           })

//         } else {
//           conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
//             if (err) {
//               logger.error(err);
//               conn.close();
//               return res.status(500).send({ error: { statusCode: 500, message: err } });
//             } else {
//               //console.log(result.length)
//               // console.log("below: Elsemain2");
//               //console.log(res.data);
//               res.data = result;
//               conn.close();
//               next();
//               process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//             }
//           })
//         }

//         // conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
//         //   if (err) {
//         //     logger.error(err);
//         //     return res.status(500).send({ error: { statusCode: 500, message: err } });
//         //   } else {
//         //     //console.log(result.length)
//         //     // console.log("below: Elsemain2");
//         //     //console.log(res.data);
//         //     res.data = result;
//         //     conn.close();
//         //     next();
//         //     process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
//         //   }
//         // })

//       }

//     }

//   }
// }

// comment end

// NEW CODE STARTS

function getAllRecord(req, res, next) {
  var url = require("url");
  const db = req.database;
  const conn = req.connection;
  var owner = req.user_id;
  var permissionObj = req.permissionColl;
  var filter = {};
  var sort = {};
  console.log("------URL -------", req.url);
  if (req.model == "notifications") {
    return res
      .status(500)
      .send({ error: { statusCode: 401, message: "Access Denied" } });
  } else {
    console.log("Else ---", permissionObj);

    if (permissionObj == "true") {
      //  v2 template
      var query = url.parse(req.url, true).query;
      if (query && query.filter) {
        //console.log(query.filter);
        filter = JSON.parse(query.filter);
        conn.db
          .collection(req.model)
          .find(filter, { _id: 0 })
          .sort(sort)
          .toArray(function (err, result) {
            res.data = [];
            res.data = result;
            //console.log("below: Ifmaintrue");
            //console.log(res.data);
            conn.close();
            next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          });
      }
      //end v2 template
      else {
        //console.log(req.headers['x-everlive-filter']);
        //console.log(req.headers['x-everlive-sort']);
        if (
          req.headers["x-everlive-filter"] &&
          decodeURIComponent(req.headers["x-everlive-filter"])
        ) {
          try {
            filter = JSON.parse(
              decodeURIComponent(req.headers["x-everlive-filter"])
            );
          } catch (e) {
            logger.error(e);
            filter = decodeURIComponent(
              JSON.parse(
                '"' +
                  req.headers["x-everlive-filter"].replace(/\"/g, '\\"') +
                  '"'
              )
            );
            filter = JSON.parse(filter);
          }
          console.log(JSON.stringify(filter));
        }
        if (
          req.headers["x-everlive-sort"] &&
          decodeURIComponent(req.headers["x-everlive-sort"])
        ) {
          sort = JSON.parse(decodeURIComponent(req.headers["x-everlive-sort"]));
        }

        if (
          req.headers["x-everlive-skip"] &&
          decodeURIComponent(req.headers["x-everlive-skip"])
        ) {
          var skip = JSON.parse(
            decodeURIComponent(req.headers["x-everlive-skip"])
          );
          skip = skip - 1;
          conn.db
            .collection(req.model)
            .find(filter, { _id: 0 })
            .limit(20)
            .skip(skip)
            .sort(sort)
            .toArray(function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              } else {
                res.data = result;
                // console.log("below: Elsemain1true");
                // console.log(res.data);
                conn.close();
                next();
                process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
              }
            });
        } else {
          conn.db
            .collection(req.model)
            .find(filter, { _id: 0 })
            .sort(sort)
            .toArray(function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              } else {
                res.data = result;
                // console.log("below: Elsemain1true");
                // console.log(res.data);
                conn.close();
                next();
                process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
              }
            });
        }
      }
    } else {
      //  v2 template
      var query = url.parse(req.url, true).query;
      if (query && query.filter) {
        filter = JSON.parse(query.filter);
        filter.Owner = owner;
        conn.db
          .collection(req.model)
          .find(filter, { _id: 0 })
          .sort(sort)
          .toArray(function (err, result) {
            if (req.url.match("reaction")) {
              filter.Owner = "Generic";
              conn.db
                .collection(req.model)
                .find(filter, { _id: 0 })
                .sort(sort)
                .toArray(function (err2, result1) {
                  console.log(result1, ">>>>>>>>>");
                  if (err2) {
                    logger.error(err2);
                    conn.close();
                    return res
                      .status(500)
                      .send({ error: { statusCode: 500, message: err2 } });
                  } else {
                    res.data = [];
                    if (result && result.length > 0) {
                      res.data = result.concat(result1);
                    } else {
                      res.data = result1;
                    }
                    conn.close();
                    next();
                    process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                  }
                });
            } else {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              } else {
                res.data = [];
                res.data = result;
                conn.close();
                next();
                process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
              }
            }
          });
      }
      //end v2 template
      else {
        if (
          req.headers["x-everlive-filter"] &&
          decodeURIComponent(req.headers["x-everlive-filter"])
        ) {
          try {
            filter = JSON.parse(
              decodeURIComponent(req.headers["x-everlive-filter"])
            );
          } catch (e) {
            logger.error(e);
            filter = decodeURIComponent(
              JSON.parse(
                '"' +
                  req.headers["x-everlive-filter"].replace(/\"/g, '\\"') +
                  '"'
              )
            );
            filter = JSON.parse(filter);
          }
        }
        if (
          req.headers["x-everlive-sort"] &&
          decodeURIComponent(req.headers["x-everlive-sort"])
        ) {
          sort = JSON.parse(decodeURIComponent(req.headers["x-everlive-sort"]));
        }
        filter.Owner = owner;

        if (
          req.headers["x-everlive-skip"] &&
          decodeURIComponent(req.headers["x-everlive-skip"])
        ) {
          var skip = JSON.parse(
            decodeURIComponent(req.headers["x-everlive-skip"])
          );
          skip = skip - 1;

          conn.db
            .collection(req.model)
            .find(filter, { _id: 0 })
            .limit(20)
            .skip(skip)
            .sort(sort)
            .toArray(function (err, result) {
              if (req.url.match("reaction")) {
                filter.Owner = "Generic";
                conn.db
                  .collection(req.model)
                  .find(filter, { _id: 0 })
                  .sort(sort)
                  .toArray(function (err2, result1) {
                    if (err2) {
                      logger.error(err2);
                      conn.close();
                      return res
                        .status(500)
                        .send({ error: { statusCode: 500, message: err2 } });
                    } else {
                      res.data = [];
                      if (result && result.length > 0) {
                        res.data = result.concat(result1);
                      } else {
                        res.data = result1;
                      }
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  });
              } else {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  res.data = result;
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              }
            });
        } else {
          console.log("------URL -------", req.url);
          conn.db
            .collection(req.model)
            .find(filter, { _id: 0 })
            .sort(sort)
            .toArray(function (err, result) {
              if (req.url.match("reaction")) {
                filter.Owner = "Generic";
                conn.db
                  .collection(req.model)
                  .find(filter, { _id: 0 })
                  .sort(sort)
                  .toArray(function (err2, result1) {
                    if (err2) {
                      logger.error(err2);
                      conn.close();
                      return res
                        .status(500)
                        .send({ error: { statusCode: 500, message: err2 } });
                    } else {
                      res.data = [];
                      if (result && result.length > 0) {
                        res.data = result.concat(result1);
                      } else {
                        res.data = result1;
                      }
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  });
              } else {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  //console.log(result.length)
                  // console.log("below: Elsemain2");
                  //console.log(res.data);
                  res.data = result;
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              }
            });
        }
      }
    }
  }
}

// NEW CODE ENDS

function getRecordrById(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var methodType = req.methodType;
  var requestedId = req.params.id;
  var permissionObj = req.permissionColl;
  var model = {};
  //console.log("requested id:"+requestedId);
  if (permissionObj == "true") {
    conn.db
      .collection(req.model)
      .findOne({ Id: requestedId }, { _id: 0 }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res
            .status(500)
            .send({ error: { statusCode: 500, message: err } });
        } else {
          res.data = user;
          //  console.log(res.data);
          conn.close();
          next();
          process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
        }
      });
  } else {
    //console.log("--------------else---------");
    conn.db
      .collection(req.model)
      .findOne({ Id: requestedId }, { _id: 0 }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res
            .status(500)
            .send({ error: { statusCode: 500, message: err } });
        } else {
          //console.log("below: ElsebyId and result");
          res.data = user;
          //console.log(res.data);
          conn.close();
          next();
          process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
        }
      });
  }
}

function updateRecord(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  // const owner = req.user_id;
  var owner;
  if (req.body.Owner) {
    owner = req.body.Owner;
  } else {
    owner = req.user_id;
  }
  var roleName = req.roleName;
  var methodType = req.methodType;
  var permissionObj = req.permissionColl;
  var model = {};
  //console.log(req.body.$set);

  if (permissionObj == "true") {
    if (req.body.Id) {
      // for restapicall
      if (req.model == "app_user") {
        if (req.body) {
          if (!req.body.rubriek) {
            // Check exsiting RUBRIEK value Start

            conn.db
              .collection(req.model)
              .find({ Id: req.body.Id }, { _id: 0 })
              .toArray(function (err, result) {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  res.data = result;
                  var _rubriek = result[0].rubriek;

                  if (
                    _rubriek == "" ||
                    _rubriek == null ||
                    _rubriek == undefined ||
                    _rubriek == "undefined"
                  ) {
                    req.body.rubriek = "Leeg";
                  } else {
                  }
                }
                // Check exsiting RUBRIEK value End

                req.body.ModifiedBy = req.user_id;
                req.body.ModifiedAt = new Date();
                conn.db
                  .collection(req.model)
                  .update(
                    { Id: req.body.Id },
                    { $set: req.body },
                    function (err, result) {
                      if (err) {
                        logger.error(err);
                        conn.close();
                        return res
                          .status(500)
                          .send({ error: { statusCode: 500, message: err } });
                      }
                      res.data = {
                        ModifiedAt: new Date(),
                        Result: result.result.ok,
                      };
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  );
              });
          } else {
            req.body.ModifiedBy = req.user_id;
            req.body.ModifiedAt = new Date();
            conn.db
              .collection(req.model)
              .update(
                { Id: req.body.Id },
                { $set: req.body },
                function (err, result) {
                  if (err) {
                    logger.error(err);
                    conn.close();
                    return res
                      .status(500)
                      .send({ error: { statusCode: 500, message: err } });
                  }
                  res.data = {
                    ModifiedAt: new Date(),
                    Result: result.result.ok,
                  };
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              );
          }
        }
      } else {
        //PUT API START
        req.body.ModifiedBy = req.user_id;
        req.body.ModifiedAt = new Date();
        conn.db
          .collection(req.model)
          .update(
            { Id: req.body.Id },
            { $set: req.body },
            function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              }
              res.data = {
                ModifiedAt: new Date(),
                Result: result.result.ok,
              };
              conn.close();
              next();
              process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
            }
          );
        //PUT API END
      }
    } else if (req.body.$set) {
      // for appAPI call
      if (req.model == "app_user") {
        if (req.body.$set) {
          if (!req.body.$set.rubriek) {
            // Check exsiting RUBRIEK value Start

            conn.db
              .collection(req.model)
              .find({ Id: req.body.$set.Id }, { _id: 0 })
              .toArray(function (err, result) {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  res.data = result;
                  var _rubriek = result[0].rubriek;

                  if (
                    _rubriek == "" ||
                    _rubriek == null ||
                    _rubriek == undefined ||
                    _rubriek == "undefined"
                  ) {
                    req.body.$set.rubriek = "Leeg";
                  } else {
                  }
                }
                // Check exsiting RUBRIEK value End
                // PUT API START
                req.body.$set.ModifiedBy = req.user_id;
                req.body.$set.ModifiedAt = new Date();
                conn.db
                  .collection(req.model)
                  .update(
                    { Id: req.body.$set.Id },
                    req.body,
                    function (err, result) {
                      if (err) {
                        logger.error(err);
                        conn.close();
                        return res
                          .status(500)
                          .send({ error: { statusCode: 500, message: err } });
                      }

                      res.data = {
                        ModifiedAt: new Date(),
                        Result: result.result.ok,
                      };
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  );
                // PUT API END
              });
          } else {
            // PUT API START
            req.body.$set.ModifiedBy = req.user_id;
            req.body.$set.ModifiedAt = new Date();
            conn.db
              .collection(req.model)
              .update(
                { Id: req.body.$set.Id },
                req.body,
                function (err, result) {
                  if (err) {
                    logger.error(err);
                    conn.close();
                    return res
                      .status(500)
                      .send({ error: { statusCode: 500, message: err } });
                  }

                  res.data = {
                    ModifiedAt: new Date(),
                    Result: result.result.ok,
                  };
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              );
            // PUT API END
          }
        }
      } else {
        // PUT API START
        req.body.$set.ModifiedBy = req.user_id;
        req.body.$set.ModifiedAt = new Date();
        conn.db
          .collection(req.model)
          .update({ Id: req.body.$set.Id }, req.body, function (err, result) {
            if (err) {
              logger.error(err);
              conn.close();
              return res
                .status(500)
                .send({ error: { statusCode: 500, message: err } });
            }

            res.data = {
              ModifiedAt: new Date(),
              Result: result.result.ok,
            };
            conn.close();
            next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          });
        // PUT API END
      }
    } else {
      logger.error("Id is required");
      return res
        .status(422)
        .send({ error: { statusCode: 422, message: "Id is required" } });
    }
  } else {
    if (req.body.Id) {
      // for restapicall
      if (req.model == "app_user") {
        if (req.body) {
          if (!req.body.rubriek) {
            // LOGIC MODIFICATIONS FOR RUBRIEK START
            // Check exsiting RUBRIEK value Start

            conn.db
              .collection(req.model)
              .find({ Id: req.body.Id }, { _id: 0 })
              .toArray(function (err, result) {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  res.data = result;
                  var _rubriek = result[0].rubriek;

                  if (
                    _rubriek == "" ||
                    _rubriek == null ||
                    _rubriek == undefined ||
                    _rubriek == "undefined"
                  ) {
                    req.body.rubriek = "Leeg";
                  } else {
                  }
                }
                // Check exsiting RUBRIEK value End

                req.body.ModifiedBy = req.user_id;
                req.body.ModifiedAt = new Date();
                conn.db
                  .collection(req.model)
                  .update(
                    { Id: req.body.Id, Owner: owner },
                    { $set: req.body },
                    function (err, result) {
                      if (err) {
                        logger.error(err);
                        conn.close();
                        return res
                          .status(500)
                          .send({ error: { statusCode: 500, message: err } });
                      }

                      res.data = {
                        ModifiedAt: new Date(),
                        Result: result.result.ok,
                      };
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  );
              });

            // LOGIC MODIFICATIONS FOR RUBRIEK END
          } else {
            // PUT API if Model is NOT app user Start
            req.body.ModifiedBy = req.user_id;
            req.body.ModifiedAt = new Date();
            conn.db
              .collection(req.model)
              .update(
                { Id: req.body.Id, Owner: owner },
                { $set: req.body },
                function (err, result) {
                  if (err) {
                    logger.error(err);
                    conn.close();
                    return res
                      .status(500)
                      .send({ error: { statusCode: 500, message: err } });
                  }

                  res.data = {
                    ModifiedAt: new Date(),
                    Result: result.result.ok,
                  };
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              );

            // PUT API if Model is NOT app user End
          }
        }
      } else {
        // PUT API if Model is NOT app user Start
        req.body.ModifiedBy = req.user_id;
        req.body.ModifiedAt = new Date();
        conn.db
          .collection(req.model)
          .update(
            { Id: req.body.Id, Owner: owner },
            { $set: req.body },
            function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              }

              res.data = {
                ModifiedAt: new Date(),
                Result: result.result.ok,
              };
              conn.close();
              next();
              process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
            }
          );

        // PUT API if Model is NOT app user End
      }
    } else if (req.body.$set) {
      // for appAPI call
      if (req.model == "app_user") {
        if (req.body.$set) {
          if (!req.body.$set.rubriek) {
            // Check exsiting RUBRIEK value Start

            conn.db
              .collection(req.model)
              .find({ Id: req.$set.body.Id }, { _id: 0 })
              .toArray(function (err, result) {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  res.data = result;
                  var _rubriek = result[0].rubriek;

                  if (
                    _rubriek == "" ||
                    _rubriek == null ||
                    _rubriek == undefined ||
                    _rubriek == "undefined"
                  ) {
                    req.body.$set.rubriek = "Leeg";
                  } else {
                  }
                }
                // Check exsiting RUBRIEK value End
                // Code to remove emojis from text fields Start
                var _keys = Object.keys(req.body.$set);
                _keys.forEach((key) => {
                  if (
                    req.body.$set[key] != "" &&
                    typeof req.body.$set[key] == "string"
                  ) {
                    req.body.$set[key] = req.body.$set[key].replace(
                      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                      ""
                    );
                  }
                });
                // Code to remove emojis from text fields End
                //PUT API START
                req.body.$set.ModifiedBy = req.user_id;
                req.body.$set.ModifiedAt = new Date();

                conn.db
                  .collection(req.model)
                  .update(
                    { Id: req.body.$set.Id, Owner: owner },
                    req.body,
                    function (err, result) {
                      if (err) {
                        logger.error(err);
                        conn.close();
                        return res
                          .status(500)
                          .send({ error: { statusCode: 500, message: err } });
                      }
                      res.data = {
                        ModifiedAt: new Date(),
                        Result: result.result.ok,
                      };
                      conn.close();
                      next();
                      process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                    }
                  );
                //PUT API END
              });
            // req.body.$set.rubriek = 'Leeg';
          } else {
            // Code to remove emojis from text fields Start
            var _keys = Object.keys(req.body.$set);
            _keys.forEach((key) => {
              if (
                req.body.$set[key] != "" &&
                typeof req.body.$set[key] == "string"
              ) {
                req.body.$set[key] = req.body.$set[key].replace(
                  /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                  ""
                );
              }
            });
            // Code to remove emojis from text fields End
            //PUT API START
            req.body.$set.ModifiedBy = req.user_id;
            req.body.$set.ModifiedAt = new Date();

            conn.db
              .collection(req.model)
              .update(
                { Id: req.body.$set.Id, Owner: owner },
                req.body,
                function (err, result) {
                  if (err) {
                    logger.error(err);
                    conn.close();
                    return res
                      .status(500)
                      .send({ error: { statusCode: 500, message: err } });
                  }
                  res.data = {
                    ModifiedAt: new Date(),
                    Result: result.result.ok,
                  };
                  conn.close();
                  next();
                  process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                }
              );

            //PUT API END
          }
        }
      } else {
        //PUT API START
        req.body.$set.ModifiedBy = req.user_id;
        req.body.$set.ModifiedAt = new Date();

        conn.db
          .collection(req.model)
          .update(
            { Id: req.body.$set.Id, Owner: owner },
            req.body,
            function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              }
              res.data = {
                ModifiedAt: new Date(),
                Result: result.result.ok,
              };
              conn.close();
              next();
              process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
            }
          );

        //PUT API END
      }
    } else {
      logger.error("Id is required");
      return res
        .status(422)
        .send({ error: { statusCode: 422, message: "Id is required" } });
    }
  }
}

function updateRecordById(req, res, next) {
  var id = req.params.id;
  const db = req.database;
  const conn = req.connection;
  // const owner = req.user_id;
  var owner;
  if (req.body.Owner) {
    owner = req.body.Owner;
  } else {
    owner = req.user_id;
  }
  var roleName = req.roleName;
  var methodType = req.methodType;
  var permissionObj = req.permissionColl;
  var model = {};

  if (req.params.id) {
    // for restapicall
    if (req.model == "app_user") {
      if (req.body) {
        if (!req.body.rubriek) {
          // Check exsiting RUBRIEK value Start

          conn.db
            .collection(req.model)
            .find({ Id: req.params.id }, { _id: 0 })
            .toArray(function (err, result) {
              if (err) {
                logger.error(err);
                conn.close();
                return res
                  .status(500)
                  .send({ error: { statusCode: 500, message: err } });
              } else if (result && result.length > 0) {
                // res.data = result; <==== commented by Piyush, improved
                var _rubriek = result[0].rubriek;
                if (
                  _rubriek == "" ||
                  _rubriek == null ||
                  _rubriek == undefined ||
                  _rubriek == "undefined"
                ) {
                  req.body.rubriek = "Leeg";
                }
              }

              // Check exsiting RUBRIEK value End
              // PUT API START
              //req.body.ModifiedBy = req.user_id;
              req.body.ModifiedAt = new Date();
              conn.db
                .collection(req.model)
                .update(
                  { Id: req.params.id },
                  { $set: req.body },
                  function (err, result) {
                    if (err) {
                      logger.error(err);
                      conn.close();
                      return res
                        .status(500)
                        .send({ error: { statusCode: 500, message: err } });
                    }

                    res.data = {
                      ModifiedAt: new Date(),
                      Result: result.result.ok,
                    };
                    conn.close();
                    next();
                    process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
                  }
                );
              // PUT API END
            });
          // req.body.rubriek = 'Leeg';
        } else {
          // PUT API START
          //req.body.ModifiedBy = req.user_id;
          req.body.ModifiedAt = new Date();
          conn.db
            .collection(req.model)
            .update(
              { Id: req.params.id },
              { $set: req.body },
              function (err, result) {
                if (err) {
                  logger.error(err);
                  conn.close();
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                }

                res.data = {
                  ModifiedAt: new Date(),
                  Result: result.result.ok,
                };
                conn.close();
                next();
                process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
              }
            );
          // PUT API END
        }
      }
    } else {
      // PUT API START
      //req.body.ModifiedBy = req.user_id;
      req.body.ModifiedAt = new Date();
      conn.db
        .collection(req.model)
        .update(
          { Id: req.params.id },
          { $set: req.body },
          function (err, result) {
            if (err) {
              logger.error(err);
              conn.close();
              return res
                .status(500)
                .send({ error: { statusCode: 500, message: err } });
            }

            res.data = {
              ModifiedAt: new Date(),
              Result: result.result.ok,
            };
            conn.close();
            next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          }
        );
      // PUT API END
    }
  } else {
    logger.error("Id is required");
    return res
      .status(422)
      .send({ error: { statusCode: 422, message: "Id is required" } });
  }
}

function deleteRecord(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var methodType = req.methodType;
  var permissionObj = req.permissionColl;
  var model = {};
  if (permissionObj == "true") {
    conn.db
      .collection(req.model)
      .remove({ Id: req.params.id }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res
            .status(500)
            .send({ error: { statusCode: 500, message: err } });
        }
        if (user.result.n == 0) {
          conn.close();
          return res.status(422).send({
            error: { statusCode: 422, message: "No record found to delete" },
          });
        }
        res.data = { statusCode: 200, message: "Record successfully deleted" };
        conn.close();
        return next();
        process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
      });
  } else {
    conn.db
      .collection(req.model)
      .remove({ Id: req.params.id, Owner: owner }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res
            .status(500)
            .send({ error: { statusCode: 500, message: err } });
        }

        if (user.result.n == 0) {
          conn.close();
          return res.status(422).send({
            error: { statusCode: 422, message: "No record found to delete" },
          });
        }
        res.data = { statusCode: 200, message: "Record successfully deleted" };
        conn.close();
        return next();
        process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections to terminate the nodejs process
      });
  }
}

function createCollectionDynamic(req, res, next) {
  const conn = req.connection;
  console.log("----db:----: " + req.database);
  conn.on("error", function () {
    console.log("errorroror");
    logger.error("Collection not created");
    return res
      .status(500)
      .send({ error: { statusCode: 500, message: "Collection not created" } });
  });
  conn.once("open", function () {
    if (req.body.modelName && req.body.schema) {
      conn.db.collection(req.body.modelName).findOne({}, function (err, found) {
        if (!found) {
          conn.createCollection(req.body.modelName, function (error, created) {
            if (error) {
              logger.error(error);
              // conn.close();
              return res.status(500).send({
                error: { statusCode: 500, message: "Collection not created" },
              });
            } else {
              //update permission object for newly created collection
              if (req.database != "nextens") {
                updatePermissionObject(conn, req.body.modelName);
              }
              // conn.close();
              return res.status(200).send({
                error: {
                  statusCode: 200,
                  message: "Collection created successfully",
                },
              });
            }
          });
        } else {
          logger.error("Collection is already exist");
          return res.status(500).send({
            error: {
              statusCode: 500,
              message: "Collection is already exist",
            },
          });
        }
      });
    } else {
      logger.error("modelName and schema are required");
      return res.status(422).send({
        error: {
          statusCode: 422,
          message: "modelName and schema are required",
        },
      });
    }
  });
}

function deleteCollectionDynamic(req, res, next) {
  const conn = req.connection;
  conn.on("error", function () {
    console.log("errorroror");
    logger.error(
      "Collection not deleted,Something went wrong please try again later"
    );
    return res.status(500).send({
      error: {
        statusCode: 500,
        message:
          "Collection not deleted,Something went wrong please try again later",
      },
    });
  });
  conn.once("open", function () {
    conn.db.dropCollection(req.body.modelName, function (error, result) {
      console.log(":---result---:");
      console.log(result);
      if (error) {
        logger.error(error);
        return res.status(500).send({
          error: {
            statusCode: 500,
            message:
              "Collection not deleted,Something went wrong please try again later",
          },
        });
      } else if (result) {
        console.log(result);
        logger.info(result);
        if (req.database != "nextens") {
          removePermissionObject(req.connection, req.body.modelName);
        }
        logger.info("Collection successfully deleted");
        return res.status(200).json({
          msg: "Collection successfully deleted",
          coll_name: req.body.modelName,
        });
      } else {
        logger.error("Collection not deleted,please try again");
        return res.status(200).json({
          msg: "Collection not deleted,please try again",
          coll_name: req.body.modelName,
        });
      }
    });
  });
}

function updatePermissionObject(conn, modelName) {
  //update permission object for newly created collection
  // var Role1 = conn.model('roles',RolePermission.schema);
  conn.db
    .collection("role_permissions")
    .find({})
    .toArray(function (error, sRole) {
      if (error) {
        logger.error(error);
        return res.status(500).send({
          error: {
            statusCode: 500,
            message:
              "Collection not deleted,Something went wrong please try again later",
          },
        });
      }
      if (!sRole) {
        logger.error("No role found,permission object is not updated");
        return res.status(500).send({
          error: {
            statusCode: 500,
            message: "No role found,permission object is not updated",
          },
        });
      } else {
        sRole.forEach((record) => {
          record.permission[modelName] = {
            read: true,
            create: true,
            update: true,
            delete: true,
          };
          var role_permissions3 = conn.model(
            "role_permissions",
            RolePermission.schema
          );
          role_permissions3.update(
            { Id: record.Id },
            { $set: record },
            { upsert: true },
            function (err, user) {
              if (err) {
                logger.error(err);
                return res.status(500).send({
                  error: {
                    statusCode: 500,
                    message: "Permission object is not updated",
                  },
                });
              }
              if (!user) {
                logger.error("Permission object is not updated");
                return res.status(422).send({
                  error: {
                    statusCode: 422,
                    message: "Permission object is not updated",
                  },
                });
              }
            }
          );
        });
      }
    });
}

function removePermissionObject(conn, modelName) {
  //remove permission for deleted collection
  var Role1 = conn.model("roles", RolePermission.schema);
  Role1.find({}, function (error, sRole) {
    if (!sRole) {
      logger.error("No role found,permission object is not updated");
      return res.status(500).send({
        error: {
          statusCode: 500,
          message: "No role found,permission object is not updated",
        },
      });
    } else {
      sRole.forEach((record) => {
        delete record.permission[modelName];
        var role_permissions3 = conn.model(
          "role_permissions",
          RolePermission.schema
        );
        role_permissions3.update(
          { Id: record.Id },
          { $set: record },
          { upsert: true },
          function (err, user) {
            if (err) {
              logger.error(err);
              return res.status(500).send({
                error: {
                  statusCode: 500,
                  message: "Permission object is not updated",
                },
              });
            }
            if (!user) {
              logger.error("Permission object is not updated");
              return res.status(422).send({
                error: {
                  statusCode: 422,
                  message: "Permission object is not updated",
                },
              });
            }
          }
        );
      });
    }
  });
}

function deletefieldsFromCollection(req, res, next) {
  // db.example.update({}, {$unset: {words:1}}, false, true); //for single record
  //db.example.update({}, {$unset: {words:1}} , {multi: true}); // for multi record
  const conn = req.connection;
  conn.db
    .collection(req.model)
    .update(
      {},
      { $unset: req.body.properties },
      { multi: true },
      function (err, result) {
        if (err) {
          logger.error(err);
          return res.status(500).send({
            error: {
              statusCode: 500,
              message: "Field not deleted, please try again later",
            },
          });
        } else if (result.result.nModified != 0) {
          console.log(result.result.nModified);
          logger.info("Fields are deleted");
          return res
            .status(200)
            .json({ msg: "Fields are deleted", coll_name: req.model });
        } else {
          logger.error("Fields not found");
          return res
            .status(200)
            .json({ msg: "Fields not found", coll_name: req.model });
        }
      }
    );
}

function deleteAllDataFromCollection(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;
  var model = {};
  // console.log(req.body);
  if (req.query.deleteAll) {
    conn.db.collection(req.model).remove({}, function (err, user) {
      if (err) {
        return res
          .status(500)
          .send({ error: { statusCode: 500, message: err } });
      } else {
        return res
          .status(200)
          .send({ success: "All documents has been deleted", statusCode: 200 });
        console.log("---removed the collection---");
      }
    });
  } else {
    return res.status(500).send({
      error: {
        statusCode: 500,
        message: "Not deleted missing delete toggle",
      },
    });
  }
}

function getNotifications(req, res, next) {
  const User = require("../models/user");
  var url = require("url");
  const db = req.database;
  const conn = req.connection;
  var owner = req.user_id;
  var permissionObj = req.permissionColl;
  var sort = {};
  var app_user = "";
  var filter = {};
  var player_id;
  var User1 = conn.model("user", User.schema);
  User1.findOne({ Id: owner }).then((user) => {
    player_id = user.PlayerId;

    if (permissionObj == "true") {
      var query = url.parse(req.url, true).query;
      if (
        req.headers["x-everlive-sort"] &&
        decodeURIComponent(req.headers["x-everlive-sort"])
      ) {
        sort = JSON.parse(decodeURIComponent(req.headers["x-everlive-sort"]));
      }
      if (req.headers["x-everlive-app-user"]) {
        app_user = req.headers["x-everlive-app-user"];
        (filter = {
          $or: [
            { "pushPayload.included_segments": app_user },
            { "pushPayload.included_segments": "All" },
            { "pushPayload.include_player_ids": player_id },
          ],
        }),
          { _id: 0 };
      } else {
        (filter = {
          $or: [
            { "pushPayload.included_segments": "non_app_users" },
            { "pushPayload.included_segments": "app_users" },
            { "pushPayload.included_segments": "All" },
            { "pushPayload.include_player_ids": player_id },
          ],
        }),
          { _id: 0 };
      }
      conn.db
        .collection(req.model)
        .find(filter)
        .limit(10)
        .sort(sort)
        .toArray(function (err, result) {
          if (err) {
            logger.error(err);
            conn.close();
            return res
              .status(500)
              .send({ error: { statusCode: 500, message: err } });
          } else {
            res.data = result;
            conn.close();
            next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          }
        });
    } else {
      //  v2 template
      var query = url.parse(req.url, true).query;
      if (
        req.headers["x-everlive-sort"] &&
        decodeURIComponent(req.headers["x-everlive-sort"])
      ) {
        sort = JSON.parse(decodeURIComponent(req.headers["x-everlive-sort"]));
      }
      if (req.headers["x-everlive-app-user"]) {
        app_user = req.headers["x-everlive-app-user"];
        (filter = {
          $or: [
            { "pushPayload.included_segments": app_user },
            { "pushPayload.included_segments": "All" },
            { "pushPayload.include_player_ids": player_id },
          ],
        }),
          { _id: 0 };
      } else {
        (filter = {
          $or: [
            { "pushPayload.included_segments": "non_app_users" },
            { "pushPayload.included_segments": "app_users" },
            { "pushPayload.included_segments": "All" },
            { "pushPayload.include_player_ids": player_id },
          ],
        }),
          { _id: 0 };
      }
      conn.db
        .collection(req.model)
        .find(filter)
        .limit(10)
        .sort(sort)
        .toArray(function (err, result) {
          if (err) {
            logger.error(err);
            conn.close();
            return res
              .status(500)
              .send({ error: { statusCode: 500, message: err } });
          } else {
            res.data = result;
            conn.close();
            next();
            process.on("unhandledRejection", (up) => {}); // this used for Unhandled promise rejections
          }
        });
    }
  });
}

function deleteNotifications(req, res, next) {
  try {
    var dayCount;
    if (req.body && req.body.dayCount) {
      dayCount = req.body.dayCount;
    } else {
      dayCount = 3;
    }
    MongoClient.connect(url, function (err, db) {
      var adminDb = db.admin();
      adminDb.listDatabases(function (err, result) {
        result.databases.forEach((database, index) => {
          var db1 = db.db(database.name);
          db1.listCollections().toArray(function (err, collInfos) {
            collInfos.forEach((collection, index2) => {
              if (collection.name == "notifications") {
                var _d = new Date();
                _d.setDate(_d.getDate() - dayCount);
                db1
                  .collection("notifications")
                  .remove(
                    { CreatedAt: { $lt: new Date(_d) } },
                    function (err, result) {
                      db.close();
                      return res
                        .status(500)
                        .send({ error: { statusCode: 500, message: err } });
                    }
                  );
              }
              if (
                result.databases.length - 1 === index &&
                collInfos.length - 1 == index2
              ) {
                db.close();
                if (err) {
                  return res
                    .status(500)
                    .send({ error: { statusCode: 500, message: err } });
                } else {
                  return res.status(200).send({
                    success: { statusCode: 200, message: "Success!" },
                  });
                }
              }
            });
          });
        });
      });
    });
  } catch (e) {}
}

//deleteAllDocsFromCollection
function deleteAllDocsFromCollection(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  // coll = req.model;
  if (req.model) {
    conn.db.collection(req.model).deleteMany({}, function (err, result) {
      if (err) {
        return res
          .status(500)
          .send({ error: { statusCode: 500, message: err } });
      } else {
        return res.status(200).send({
          success: `${result[`deletedCount`]} documents has been deleted from ${
            req.model
          }`,
          Result: result,
          statusCode: 200,
        });
        console.log("---removed all docs from collection---");
      }
    });
  }
}
