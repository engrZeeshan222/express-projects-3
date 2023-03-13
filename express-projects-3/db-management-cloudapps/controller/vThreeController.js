const RolePermission = require('../models/role_permissions');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var async1 =  require('async');
var uuid = require('uuid/v4');

var EmailService = require('../service/emailService');

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
  updateRecordById,
  getOwner
};

function getOwner(req,res,next){
  console.log(req.params);
}

function createRecord(req,res,next){
  const conn = req.connection;
  req.body.CreatedBy = req.user_id;
  req.body.ModifiedBy = req.user_id;
  req.body.Owner = req.user_id;
  var permissionObj = req.permissionColl;


    if(req.body.Result){
      conn.db.collection(req.model).remove({}, function(err, user){
         if (err){
             conn.close();
            return res.status(500).send({error:{ statusCode:500,message: err}});
         }
       });

         if(permissionObj == 'true'){

           async1.forEach(req.body.Result, function(record, callback) {
             if(req.model == 'app_user'){
               if(!record.rubriek){
                   record.rubriek = 'Leeg';
               }
             }
               conn.db.collection(req.model).findOneAndUpdate({Id: record.Id},record, {upsert: true}, function(error,createdUser){
                     callback();
               })
            },function(err){
              if( err ) {
                logger.error(err);
                conn.close();
                return res.status(500).send({error:{ statusCode:500,message:err}});
              }
                res.data = { statusCode:200,message: req.model+' successfully imported'};
                conn.close();
                return next();
            })
       }else {
          conn.close();
          return res.status(403).send({error:{ statusCode:403,message:'Permission denied,You are not authorized user'}});
       }

   }else {
          try {
            if(permissionObj == 'true'){
              if(req.model == 'app_user'){
                if(!req.body.rubriek){
                    req.body.rubriek = 'Leeg';
                }
                conn.db.collection(req.model).findOne({$or:[{deviceID:req.body.deviceID},{email:req.body.email}]},function(er,sAppusr){

                  if(!sAppusr){
                    req.body.Id = uuid();
                    req.body.CreatedAt = new Date();
                    req.body.ModifiedAt = new Date();
                   conn.db.collection(req.model).insert(req.body, function(error3,createdUser){
                     if(error3){
                      logger.error(error3);
                         if(!res.headersSent){
                             conn.close();
                              return res.status(500).send({error:{ statusCode:500,message:error3}});
                            }
                     }

                       try {
                         EmailService.sendEmail(createdUser.ops[0],req.model,conn); // send mail
                       } catch (e) {
                        logger.error(e);

                       }

                       res.data = {
                                "Id": createdUser.ops[0].Id,
                                "CreatedAt": new Date()
                        };
                        conn.close();
                       return next();
                       process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
                   })
                  }else{
                    res.data = {
                             "Id": sAppusr.Id,
                             "CreatedAt": new Date()
                     };
                     conn.close();
                     return next();
                  }
                })
              }else{
                req.body.Id = uuid();
                req.body.CreatedAt = new Date();
                req.body.ModifiedAt = new Date();
               conn.db.collection(req.model).insert(req.body, function(error3,createdUser){
                 if(error3){
                  logger.error(error3);
                     if(!res.headersSent){
                         conn.close();
                          return res.status(500).send({error:{ statusCode:500,message:error3}});
                        }
                 }

                   try {
                     EmailService.sendEmail(createdUser.ops[0],req.model,conn); // send mail
                   } catch (e) {
                    logger.error(e);

                   }

                   res.data = {
                            "Id": createdUser.ops[0].Id,
                            "CreatedAt": new Date()
                    };
                    conn.close();
                   return next();
                   process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
               })
              }

            }else {
                conn.close();
                return res.status(403).send({error:{ statusCode:403,message:'Permission denied,You are not authorized user'}});
            }
          } catch (e) {
              logger.error(e);
              conn.close();
            return res.status(500).send({error:{ statusCode:500,message:'Internal server error'}});
          }
       }

}

function getAllRecord(req,res,next){
  var url = require('url');
  const conn = req.connection;
  var owner = req.user_id;
  var permissionObj = req.permissionColl;
 var filter = {};
 var sort = {};
   if(permissionObj == 'true'){

      //  v2 template
       var query = url.parse(req.url,true).query;
        if(query && query.filter){

          filter = JSON.parse(query.filter);
          conn.db.collection(req.model).find(filter,{'_id': 0}).sort(sort).toArray(function(err,result){
            res.data = [];
              res.data = result;
            conn.close();
            next();
            process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
          })
        }
        //end v2 template
        else {

          if(req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])){
            try{
              filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
            }catch(e){
              logger.error(e);
              filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
              filter = JSON.parse(filter);
            }

          }
         if(req.headers['x-everlive-sort'] && decodeURIComponent(req.headers['x-everlive-sort'])){
              sort = JSON.parse(decodeURIComponent(req.headers['x-everlive-sort']));
          }


        //  conn.db.collection(req.model).find(filter,{'_id': 0}).sort(sort).toArray(function(err, result){
        //    if(err){
        //        return res.status(500).send({error:{ statusCode:500,message:err}});
        //    }else {
        //        res.data = result;

        //        conn.close();
        //        next();
        //        process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        //   }
        //  })

        if (req.headers['x-everlive-skip'] && decodeURIComponent(req.headers['x-everlive-skip'])) {
          var skip = JSON.parse(decodeURIComponent(req.headers['x-everlive-skip']));
          skip = skip - 1;
          conn.db.collection(req.model).find(filter, { '_id': 0 }).limit(10).skip(skip).sort(sort).toArray(function (err, result) {
            if (err) {
              return res.status(500).send({ error: { statusCode: 500, message: err } });
            } else {
              res.data = result;
              // console.log("below: Elsemain1true");
              // console.log(res.data);
              conn.close();
              next();
              process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
            }
          });
  
        } else {
  
          conn.db.collection(req.model).find(filter, { '_id': 0 }).sort(sort).toArray(function (err, result) {
            if (err) {
              return res.status(500).send({ error: { statusCode: 500, message: err } });
            } else {
              res.data = result;
              // console.log("below: Elsemain1true");
              // console.log(res.data);
              conn.close();
              next();
              process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
            }
          });
  
        }

        }


   }else {
    //  v2 template
     var query = url.parse(req.url,true).query;
      if(query && query.filter){
        filter = JSON.parse(query.filter);
        filter.Owner =owner;
        conn.db.collection(req.model).find(filter,{'_id': 0}).sort(sort).toArray(function(err,result){
          if(err){
            return res.status(500).send({error:{ statusCode:500,message:err}});
          }else {
             res.data = [];
             res.data = result;
           conn.close();
           next();
           process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
          }
        })
      }
      //end v2 template
      else {
        if(req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])){
          try{
            filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
          }catch(e){
            filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
            filter = JSON.parse(filter);
          }
        }
        if(req.headers['x-everlive-sort'] && decodeURIComponent(req.headers['x-everlive-sort'])){
            sort = JSON.parse(decodeURIComponent(req.headers['x-everlive-sort']));
        }
        filter.Owner =owner;
        conn.db.collection(req.model).find(filter,{'_id': 0}).sort(sort).toArray(function(err,result){
          if(err){
            return res.status(500).send({error:{ statusCode:500,message:err}});
          }else {
           res.data = result;
           conn.close();
           next();
           process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
          }
        })
      }

     }
}

function getRecordrById(req,res,next){
  const conn = req.connection;
  var requestedId = req.params.id;
  var permissionObj = req.permissionColl;

    if(permissionObj == 'true'){
      conn.db.collection(req.model).findOne({Id:requestedId},{'_id': 0},function(err,user){
        if(err){
            conn.close();
          return res.status(500).send({error:{ statusCode:500,message:err}});
        }else {
          res.data = user;
        //  console.log(res.data);
          conn.close();
          next();
         process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        }
      })
    }else {
      //console.log("--------------else---------");
      conn.db.collection(req.model).findOne({Id:requestedId},{'_id': 0},function(err,user){
        if(err){
            conn.close();
          return res.status(500).send({error:{ statusCode:500,message:err}});
        }else {
          //console.log("below: ElsebyId and result");
          res.data = user;
          //console.log(res.data);
          conn.close();
          next();
         process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        }
      })
     }

}

function updateRecord(req,res,next){
  const conn = req.connection;
  const owner = req.user_id;
  var permissionObj = req.permissionColl;


    if(permissionObj == 'true'){
      if(req.body.Id){
        // for restapicall
          if(req.model == 'app_user'){
            if(req.body){
            if(!req.body.rubriek){
                req.body.rubriek = 'Leeg';
            }
          }
        }
          req.body.ModifiedBy = req.user_id;
          req.body.ModifiedAt = new Date();
          conn.db.collection(req.model).update({Id: req.body.Id}, {$set: req.body}, function(err, result){
              if(err){
                  conn.close();
                logger.error(err);
                 return res.status(500).send({error:{ statusCode:500,message:err}});
              }
               res.data = {
                    "ModifiedAt": new  Date(),
                    "Result": result.result.ok
                };
                conn.close();
                next();
                process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
        });
      }else if(req.body.$set){
          // for appAPI call
              if(req.model == 'app_user'){
                if(req.body.$set){
                if(!req.body.$set.rubriek){
                    req.body.$set.rubriek = 'Leeg';
                }
              }
            }
             req.body.$set.ModifiedBy = req.user_id;
             req.body.$set.ModifiedAt = new Date();
           conn.db.collection(req.model).update({Id: req.body.$set.Id}, req.body, function(err, result){
              if(err){
                  conn.close();
                 return res.status(500).send({error:{ statusCode:500,message:err}});
              }

               res.data = {
                    "ModifiedAt": new  Date(),
                    "Result": result.result.ok
               };
               conn.close();
               next();
               process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
           });
      }else {
         return res.status(422).send({error:{ statusCode:422,message: 'Id is required'}});
      }
    }else {
          if(req.body.Id){
            // for restapicall
              if(req.model == 'app_user'){
                if(req.body){
                if(!req.body.rubriek){
                    req.body.rubriek = 'Leeg';
                }
              }
            }
              req.body.ModifiedBy = req.user_id;
              req.body.ModifiedAt = new  Date();
               conn.db.collection(req.model).update({Id: req.body.Id, Owner: owner}, {$set: req.body}, function(err, result){
              if(err){
                  conn.close();
                logger.error(err);
                 return res.status(500).send({error:{ statusCode:500,message:err}});
              }

                   res.data = {
                    "ModifiedAt": new  Date(),
                    "Result": result.result.ok
                };
                conn.close();
                next();
                process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
            });
          }else if(req.body.$set){
            // for appAPI call
                if(req.model == 'app_user'){
                  if(req.body.$set){
                  if(!req.body.$set.rubriek){
                      req.body.$set.rubriek = 'Leeg';
                  }
                }
              }
              req.body.$set.ModifiedBy = req.user_id;
              req.body.$set.ModifiedAt = new  Date();

              conn.db.collection(req.model).update({Id: req.body.$set.Id, Owner: owner}, req.body, function(err, result){
              if(err){
                  conn.close();
                logger.error(err);
                 return res.status(500).send({error:{ statusCode:500,message:err}});
              }
               res.data = {
                    "ModifiedAt": new  Date(),
                    "Result": result.result.ok
                };
                conn.close();
                next();
                process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
           });
          } else{
              return res.status(422).send({error:{ statusCode:422,message: 'Id is required'}});
          }
        }

}

function updateRecordById(req,res,next){
  var id = req.params.id;
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var methodType = req.methodType;
  var permissionObj = req.permissionColl;
  var model = {};

  if(req.params.id){
    // for restapicall
      if(req.model == 'app_user'){
        if(req.body){
        if(!req.body.rubriek){
            req.body.rubriek = 'Leeg';
        }
      }
    }
      //req.body.ModifiedBy = req.user_id;
      req.body.ModifiedAt = new  Date();
       conn.db.collection(req.model).update({Id: req.params.id}, {$set: req.body}, function(err, result){
      if(err){
          conn.close();
        logger.error(err);
         return res.status(500).send({error:{ statusCode:500,message:err}});
      }

           res.data = {
            "ModifiedAt": new  Date(),
            "Result": result.result.ok
        };
        conn.close();
        next();
        process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
    });
  }else{
      return res.status(422).send({error:{ statusCode:422,message: 'Id is required'}});
  }
}

function deleteRecord(req,res,next){
  const conn = req.connection;
  const owner = req.user_id;
  var permissionObj = req.permissionColl;
  if(permissionObj == 'true'){
      conn.db.collection(req.model).remove({Id: req.params.id}, function(err, user){
          if (err){
              conn.close();
              return res.status(500).send({error:{ statusCode:500,message: err}});
          }
          if(user.result.n == 0){
              conn.close();
              return res.status(422).send({error:{ statusCode:422,message: 'No record found to delete'}});
          }
          res.data = { statusCode:200,message: 'Record successfully deleted'};
          conn.close();
          return next();
          process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections
      });
    }else {
        conn.db.collection(req.model).remove({Id: req.params.id,Owner:owner}, function(err, user){
          if (err){
              conn.close();
           logger.error(err);
           return res.status(500).send({error:{ statusCode:500,message: err}});
          }
           if(user.result.n == 0){
              conn.close();
              return res.status(422).send({error:{ statusCode:422,message: 'No record found to delete'}});
           }
            res.data = { statusCode:200,message: 'Record successfully deleted'};
            conn.close();
            return next();
            process.on('unhandledRejection', up => { });  // this used for Unhandled promise rejections to terminate the nodejs process
         })
    }

}

function createCollectionDynamic(req,res,next) {
    const conn = req.connection;
    conn.on('error',function(){
      return res.status(500).send({error: {statusCode: 500, message: "Collection not created"}});
    })
   conn.once('open', function() {
    if (req.body.modelName && req.body.schema) {
      conn.db.collection(req.body.modelName).findOne({},function(err,found){
        if(!found){
          conn.createCollection(req.body.modelName,function(error,created){
            if(error){
conn.close();
              return res.status(500).send({error: {statusCode: 500, message: "Collection not created"}});
            }else {
              //update permission object for newly created collection
              if(req.database != 'nextens'){
                updatePermissionObject(conn,req.body.modelName);
              }

              return res.status(200).send({error: {statusCode: 200, message: "Collection created successfully"}});
            }
          })
        }else {
          return res.status(500).send({error: {statusCode: 500, message: "Collection is already exist"}});
        }
      })

    } else {
        return res.status(422).send({error: {statusCode: 422, message: "modelName and schema are required"}});
    }
  })
}

function deleteCollectionDynamic(req,res,next) {
    const conn = req.connection;
    conn.on('error',function(){
      logger.error('Collection not deleted,Something went wrong please try again later');
        return res.status(500).send({error:{ statusCode:500,message:'Collection not deleted,Something went wrong please try again later'}});
    });
    conn.once('open', function() {
    conn.db.dropCollection(req.body.modelName,function(error,result){
      if(error){
        logger.error(error);
        conn.close();
        return res.status(500).send({error:{ statusCode:500,message:'Collection not deleted,Something went wrong please try again later'}});
      }
      else if(result){
        if(req.database != 'nextens'){
          removePermissionObject(req.connection,req.body.modelName);
        }
        return res.status(200).json({'msg': 'Collection successfully deleted', 'coll_name': req.body.modelName});
      }else {
          conn.close();
        return res.status(200).json({'msg': 'Collection not deleted,please try again', 'coll_name': req.body.modelName});
      }
    })
  })

}

function updatePermissionObject(conn,modelName){
  //update permission object for newly created collection
 // var Role1 = conn.model('roles',RolePermission.schema);
  conn.db.collection('role_permissions').find({}).toArray(function(error,sRole){
      if(error){
        logger.error(error);
conn.close();

      }
    if(!sRole){
conn.close();
      return res.status(500).send({error:{ statusCode:500,message:"No role found,permission object is not updated"}});
    }else {
      sRole.forEach((record) => {
          record.permission[modelName]= {"read":true,"create":true,"update":true,"delete":true};
          var role_permissions3 = conn.model('role_permissions',RolePermission.schema);
          role_permissions3.update({Id:record.Id }, {$set : record}, {upsert: true}, function(err, user){
           if(err){
            logger.error(err);

           }
           if(!user){

           }
          })

      })
    }
  })
}


function removePermissionObject(conn,modelName){
  //remove permission for deleted collection
  var Role1 = conn.model('roles',RolePermission.schema);
  Role1.find({},function(error,sRole){
    if(!sRole){
conn.close();
    }else {
      sRole.forEach((record) => {
          delete record.permission[modelName];
          var role_permissions3 = conn.model('role_permissions',RolePermission.schema);
          role_permissions3.update({Id:record.Id }, {$set : record}, {upsert: true}, function(err, user){

          })

      })
    }
  })
}

function deletefieldsFromCollection(req,res,next){
  // db.example.update({}, {$unset: {words:1}}, false, true); //for single record
  //db.example.update({}, {$unset: {words:1}} , {multi: true}); // for multi record
  const conn = req.connection;
  conn.db.collection(req.model).update({},{$unset:req.body.properties},{multi:true},function(err,result){
    if(err){
      logger.error(err);
      conn.close();
      return res.status(500).send({error:{ statusCode:500,message:"Field not deleted, please try again later"}});
    }else if(result.result.nModified != 0){
      console.log(result.result.nModified);
      conn.close();
      return res.status(200).json({'msg': 'Fields are deleted', 'coll_name': req.model});
    }else {
        conn.close();
      return res.status(200).json({'msg': 'Fields not found', 'coll_name': req.model});
    }
  })

}
