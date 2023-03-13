const Role = require('../models/roles');
const RolePermission = require('../models/role_permissions');
var mongoose = require('mongoose');
var async1 = require('async');

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
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
};

function createRole(req, res, next) {
  //console.log(JSON.stringify(req.body));
  const conn = req.connection;
  req.body.CreatedBy = req.user_id;
  req.body.ModifiedBy = req.user_id;
  req.body.Owner = req.user_id;
  var roleName = req.roleName;

  var userRole = req.userRole;
  var methodType = req.methodType;
  console.log("Role: " + userRole + " and methodType: " + methodType);
  if (req.body.Result) {
    if (roleName == 'Registered' || roleName == 'Res') {
      async1.forEach(req.body.Result, function (record, callback) {
        if ('isNew' in record) {
          let newVar = record.isNew;
          delete record.isNew;
          record.IsNew = newVar;
        }
        // for delete app_user and Registered user if exist for importing collection as exist on telerik
        if ('Name' in record) {
          var Role1 = conn.model('roles', Role.schema);
          Role1.findOne({ Name: record.Name }, function (errR, sRex) {
            if (!sRex) {
              // console.log("No need to do anything");
              var Role11 = conn.model('roles', Role.schema);
              var Role11 = new Role11(record);
              Role11.save(function (error, createdUser1) {
                if (error) {
                  if (!res.headersSent) {
                    conn.close();
                    return res.status(500).send({ error: { statusCode: 500, message: error } });
                  }
                }
                const appUserTablesAndPermissions1 = {
                  RoleId: createdUser1.Id,
                  permission: {
                    "app_user": { "read": false, "create": true, "update": false, "delete": false },
                    "appointments": { "read": false, "create": true, "update": false, "delete": false },
                    "AppSettings": { "read": true, "create": false, "update": false, "delete": false },
                    "berichtenarchief": { "read": true, "create": false, "update": false, "delete": false },
                    "brochures": { "read": true, "create": false, "update": false, "delete": false },
                    "client_portal_data": { "read": false, "create": true, "update": false, "delete": false },
                    "employee": { "read": true, "create": false, "update": false, "delete": false },
                    "enquete": { "read": false, "create": true, "update": false, "delete": false },
                    "favourites": { "read": false, "create": true, "update": false, "delete": false },
                    "kantoor": { "read": true, "create": false, "update": false, "delete": false },
                    "logins": { "read": true, "create": false, "update": false, "delete": false },
                    "meersortering": { "read": true, "create": false, "update": false, "delete": false },
                    "overons_sortering": { "read": true, "create": false, "update": false, "delete": false },
                    "Pagina": { "read": true, "create": false, "update": false, "delete": false },
                    "photogallery": { "read": true, "create": false, "update": false, "delete": false },
                    "questions": { "read": false, "create": true, "update": true, "delete": false },
                    "quotations": { "read": false, "create": true, "update": true, "delete": false },
                    "recommendations": { "read": true, "create": false, "update": false, "delete": false },
                    "role_permissions": { "read": false, "create": false, "update": false, "delete": false },
                    "roles": { "read": false, "create": false, "update": false, "delete": false },
                    "sector": { "read": true, "create": false, "update": false, "delete": false },
                    "select_options": { "read": true, "create": false, "update": false, "delete": false },
                    "Settings": { "read": true, "create": false, "update": false, "delete": false },
                    "social_media": { "read": true, "create": false, "update": false, "delete": false },
                    "targetgroup": { "read": true, "create": false, "update": false, "delete": false },
                    "topics": { "read": true, "create": false, "update": false, "delete": false },
                    "totalemployees": { "read": true, "create": false, "update": false, "delete": false },
                    "users": { "read": true, "create": false, "update": true, "delete": false },
                    "videos": { "read": true, "create": false, "update": false, "delete": false },
                    "webpage": { "read": true, "create": false, "update": false, "delete": false },
                  }
                };

                var role_permissions33 = conn.model('role_permissions', RolePermission.schema);
                var role_permissions33 = new role_permissions33(appUserTablesAndPermissions1);
                role_permissions33.save();

              })

            } else {
              let role_id = sRex.Id;
              // now remove the role
              Role1.remove({ Id: role_id }, function (errRv, sSucc) {
                if (sSucc.result.n != 0) {
                  // delete also role_permissions
                  var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
                  Role_permissions1.remove({ RoleId: role_id }, function (errPer, sPer) {
                    if (errPer) {

                    } else {
                      var Role1 = conn.model('roles', Role.schema);
                      var Role1 = new Role1(record);
                      Role1.save(function (error, createdUser) {
                        if (error) {
                          if (!res.headersSent) {
                            conn.close();
                            return res.status(500).send({ error: { statusCode: 500, message: error } });
                          }
                        }
                        console.log("roles id created: " + createdUser.Id);
                        if (createdUser.Name == 'Registered') {
                          const registeredUserTablesAndPermissions = {
                            RoleId: createdUser.Id,
                            permission: {
                              "app_user": { "read": true, "create": true, "update": true, "delete": true },
                              "appointments": { "read": true, "create": true, "update": true, "delete": true },
                              "AppSettings": { "read": true, "create": true, "update": true, "delete": true },
                              "berichtenarchief": { "read": true, "create": true, "update": true, "delete": true },
                              "brochures": { "read": true, "create": true, "update": true, "delete": true },
                              "client_portal_data": { "read": true, "create": true, "update": true, "delete": true },
                              "employee": { "read": true, "create": true, "update": true, "delete": true },
                              "enquete": { "read": true, "create": true, "update": true, "delete": true },
                              "favourites": { "read": true, "create": true, "update": true, "delete": true },
                              "kantoor": { "read": true, "create": true, "update": true, "delete": true },
                              "logins": { "read": true, "create": true, "update": true, "delete": true },
                              "meersortering": { "read": true, "create": true, "update": true, "delete": true },
                              "overons_sortering": { "read": true, "create": true, "update": true, "delete": true },
                              "Pagina": { "read": true, "create": true, "update": true, "delete": true },
                              "photogallery": { "read": true, "create": true, "update": true, "delete": true },
                              "questions": { "read": true, "create": true, "update": true, "delete": true },
                              "quotations": { "read": true, "create": true, "update": true, "delete": true },
                              "recommendations": { "read": true, "create": true, "update": true, "delete": true },
                              "role_permissions": { "read": true, "create": true, "update": true, "delete": true },
                              "roles": { "read": true, "create": true, "update": true, "delete": true },
                              "sector": { "read": true, "create": true, "update": true, "delete": true },
                              "select_options": { "read": true, "create": true, "update": true, "delete": true },
                              "Settings": { "read": true, "create": true, "update": true, "delete": true },
                              "social_media": { "read": true, "create": true, "update": true, "delete": true },
                              "targetgroup": { "read": true, "create": true, "update": true, "delete": true },
                              "topics": { "read": true, "create": true, "update": true, "delete": true },
                              "totalemployees": { "read": true, "create": true, "update": true, "delete": true },
                              "users": { "read": true, "create": true, "update": true, "delete": true },
                              "videos": { "read": true, "create": true, "update": true, "delete": true },
                              "webpage": { "read": true, "create": true, "update": true, "delete": true },
                            }
                          };

                          var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
                          var role_permissions2 = new role_permissions2(registeredUserTablesAndPermissions);
                          role_permissions2.save();
                        } else {
                          const appUserTablesAndPermissions = {
                            RoleId: createdUser.Id,
                            permission: {
                              "app_user": { "read": false, "create": true, "update": false, "delete": false },
                              "appointments": { "read": false, "create": true, "update": false, "delete": false },
                              "AppSettings": { "read": true, "create": false, "update": false, "delete": false },
                              "berichtenarchief": { "read": true, "create": false, "update": false, "delete": false },
                              "brochures": { "read": true, "create": false, "update": false, "delete": false },
                              "client_portal_data": { "read": false, "create": true, "update": false, "delete": false },
                              "employee": { "read": true, "create": false, "update": false, "delete": false },
                              "enquete": { "read": false, "create": true, "update": false, "delete": false },
                              "favourites": { "read": false, "create": true, "update": false, "delete": false },
                              "kantoor": { "read": true, "create": false, "update": false, "delete": false },
                              "logins": { "read": true, "create": false, "update": false, "delete": false },
                              "meersortering": { "read": true, "create": false, "update": false, "delete": false },
                              "overons_sortering": { "read": true, "create": false, "update": false, "delete": false },
                              "Pagina": { "read": true, "create": false, "update": false, "delete": false },
                              "photogallery": { "read": true, "create": false, "update": false, "delete": false },
                              "questions": { "read": false, "create": true, "update": true, "delete": false },
                              "quotations": { "read": false, "create": true, "update": true, "delete": false },
                              "recommendations": { "read": true, "create": false, "update": false, "delete": false },
                              "role_permissions": { "read": false, "create": false, "update": false, "delete": false },
                              "roles": { "read": false, "create": false, "update": false, "delete": false },
                              "sector": { "read": true, "create": false, "update": false, "delete": false },
                              "select_options": { "read": true, "create": false, "update": false, "delete": false },
                              "Settings": { "read": true, "create": false, "update": false, "delete": false },
                              "social_media": { "read": true, "create": false, "update": false, "delete": false },
                              "targetgroup": { "read": true, "create": false, "update": false, "delete": false },
                              "topics": { "read": true, "create": false, "update": false, "delete": false },
                              "totalemployees": { "read": true, "create": false, "update": false, "delete": false },
                              "users": { "read": true, "create": false, "update": true, "delete": false },
                              "videos": { "read": true, "create": false, "update": false, "delete": false },
                              "webpage": { "read": true, "create": false, "update": false, "delete": false },
                            }
                          };

                          var role_permissions3 = conn.model('role_permissions', RolePermission.schema);
                          var role_permissions3 = new role_permissions3(appUserTablesAndPermissions);
                          role_permissions3.save();
                        }
                      })
                    }

                  })
                }
              })
            }

          })

        }
        // end of if
        //console.log("rolesss: "+record);

        callback();

      }, function (err) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        res.data = { statusCode: 200, message: 'Role successfully imported' };
        logger.error(res.data);
        conn.close();
        return next();
      })
    } else {
      logger.error('Permission denied,You are not authorized user');
      conn.close();
      return res.status(403).send({ error: { statusCode: 403, message: 'Permission denied,You are not authorized user' } });
    }
  } else {

    var Role1 = conn.model('roles', Role.schema);
    var Role1 = new Role1(req.body);
    Role1.save(function (error, createdUser) {
      if (error) {
        logger.error(error);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: error } });
      }
      if (createdUser.Name == 'Registered') {
        const registeredUserTablesAndPermissions = {
          RoleId: createdUser.Id,
          permission: {
            "app_user": { "read": true, "create": true, "update": true, "delete": true },
            "appointments": { "read": true, "create": true, "update": true, "delete": true },
            "AppSettings": { "read": true, "create": true, "update": true, "delete": true },
            "berichtenarchief": { "read": true, "create": true, "update": true, "delete": true },
            "brochures": { "read": true, "create": true, "update": true, "delete": true },
            "client_portal_data": { "read": true, "create": true, "update": true, "delete": true },
            "employee": { "read": true, "create": true, "update": true, "delete": true },
            "enquete": { "read": true, "create": true, "update": true, "delete": true },
            "favourites": { "read": true, "create": true, "update": true, "delete": true },
            "kantoor": { "read": true, "create": true, "update": true, "delete": true },
            "logins": { "read": true, "create": true, "update": true, "delete": true },
            "meersortering": { "read": true, "create": true, "update": true, "delete": true },
            "overons_sortering": { "read": true, "create": true, "update": true, "delete": true },
            "Pagina": { "read": true, "create": true, "update": true, "delete": true },
            "photogallery": { "read": true, "create": true, "update": true, "delete": true },
            "questions": { "read": true, "create": true, "update": true, "delete": true },
            "quotations": { "read": true, "create": true, "update": true, "delete": true },
            "recommendations": { "read": true, "create": true, "update": true, "delete": true },
            "role_permissions": { "read": true, "create": true, "update": true, "delete": true },
            "roles": { "read": true, "create": true, "update": true, "delete": true },
            "sector": { "read": true, "create": true, "update": true, "delete": true },
            "select_options": { "read": true, "create": true, "update": true, "delete": true },
            "Settings": { "read": true, "create": true, "update": true, "delete": true },
            "social_media": { "read": true, "create": true, "update": true, "delete": true },
            "targetgroup": { "read": true, "create": true, "update": true, "delete": true },
            "topics": { "read": true, "create": true, "update": true, "delete": true },
            "totalemployees": { "read": true, "create": true, "update": true, "delete": true },
            "users": { "read": true, "create": true, "update": true, "delete": true },
            "videos": { "read": true, "create": true, "update": true, "delete": true },
            "webpage": { "read": true, "create": true, "update": true, "delete": true },
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions2 = new role_permissions2(registeredUserTablesAndPermissions);
        role_permissions2.save();
      } else {
        const appUserTablesAndPermissions = {
          RoleId: createdUser.Id,
          permission: {
            "app_user": { "read": false, "create": true, "update": false, "delete": false },
            "appointments": { "read": false, "create": true, "update": false, "delete": false },
            "AppSettings": { "read": true, "create": false, "update": false, "delete": false },
            "berichtenarchief": { "read": true, "create": false, "update": false, "delete": false },
            "brochures": { "read": true, "create": false, "update": false, "delete": false },
            "client_portal_data": { "read": false, "create": true, "update": false, "delete": false },
            "employee": { "read": true, "create": false, "update": false, "delete": false },
            "enquete": { "read": false, "create": true, "update": false, "delete": false },
            "favourites": { "read": false, "create": true, "update": false, "delete": false },
            "kantoor": { "read": true, "create": false, "update": false, "delete": false },
            "logins": { "read": true, "create": false, "update": false, "delete": false },
            "meersortering": { "read": true, "create": false, "update": false, "delete": false },
            "overons_sortering": { "read": true, "create": false, "update": false, "delete": false },
            "Pagina": { "read": true, "create": false, "update": false, "delete": false },
            "photogallery": { "read": true, "create": false, "update": false, "delete": false },
            "questions": { "read": false, "create": true, "update": true, "delete": false },
            "quotations": { "read": false, "create": true, "update": true, "delete": false },
            "recommendations": { "read": true, "create": false, "update": false, "delete": false },
            "role_permissions": { "read": false, "create": false, "update": false, "delete": false },
            "roles": { "read": false, "create": false, "update": false, "delete": false },
            "sector": { "read": true, "create": false, "update": false, "delete": false },
            "select_options": { "read": true, "create": false, "update": false, "delete": false },
            "Settings": { "read": true, "create": false, "update": false, "delete": false },
            "social_media": { "read": true, "create": false, "update": false, "delete": false },
            "targetgroup": { "read": true, "create": false, "update": false, "delete": false },
            "topics": { "read": true, "create": false, "update": false, "delete": false },
            "totalemployees": { "read": true, "create": false, "update": false, "delete": false },
            "users": { "read": true, "create": false, "update": true, "delete": false },
            "videos": { "read": true, "create": false, "update": false, "delete": false },
            "webpage": { "read": true, "create": false, "update": false, "delete": false },
          }
        };

        var role_permissions3 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions3(appUserTablesAndPermissions);
        role_permissions3.save();
      }
      createdUser = createdUser.toObject();
      delete createdUser._id;
      res.data = createdUser;
conn.close();
      return next();
    })

  }

}

function getAllRoles(req, res, next) {
  const conn = req.connection;
  var owner = req.user_id;
  var permissionObj = req.permissionColl;

  var roleName = req.roleName;

  if (permissionObj == 'true') {
    var filter = {};
    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
    }

    var Role1 = conn.model('roles', Role.schema);
    Role1.find(filter, { '_id': 0 }).sort(req.headers['x-everlive-sort']).then(user => {

      res.data = user;
      conn.close();
      next();
    }).catch(err => {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    })
  } else {
    var filter = {};
    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
    }
    filter.Owner = owner;
    var Role1 = conn.model('roles', Role.schema);
    Role1.find(filter, { '_id': 0 }).sort(req.headers['x-everlive-sort']).then(user => {

      res.data = user;
      conn.close();
      next();
    }).catch(err => {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    })
  }
}


function getRoleById(req, res, next) {
  let requestedId = req.params.id;
  console.log("requestedId: " + requestedId);
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;

  if (roleName == 'Registered' || roleName == 'Res') {
    var Role1 = conn.model('roles', Role.schema);
    Role1.findOne({ Id: requestedId }, { '_id': 0 }).then(user => {
      if (!user) {
        logger.error('No record found');
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found' } });
      }
      res.data = user;
      next();
    }).catch(err => {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    })
  } else {
    // final done by owner
    var Role1 = conn.model('roles', Role.schema);
    Role1.findOne({ Id: requestedId, Owner: owner }, { '_id': 0 }).then(user => {
      if (!user) {
        conn.close();
        logger.error('No record found');
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found' } });
      }
      res.data = user;
      conn.close();
      next();
    }).catch(err => {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    })
  }
}

function updateRole(req, res, next) {
  var conn = req.connection;
  req.body.ModifiedBy = req.user_id;
  const owner = req.user_id;
  if (req.body.CreatedBy) {
    delete req.body.CreatedBy;
  }
  if (req.body.Owner) {
    delete req.body.Owner;
  }
  var roleName = req.roleName;

  if (roleName == 'Registered' || roleName == 'Res') {
    var Role1 = conn.model('roles', Role.schema);
    if (req.body.Id) {
      Role1.findOneAndUpdate({ Id: req.body.Id }, req.body, { new: true }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        if (!user) {
          conn.close();
          logger.error('No record found to update');
          return res.status(422).send({ error: { statusCode: 422, message: 'No record found to update' } });
        }
        user = user.toObject();
        delete user._id;
        res.data = user;
        conn.close();
        return next();
      });
    } else {
      logger.error('Id is required');
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  } else {
    // if dont meet any above condition then owner can update the record
    var Role1 = conn.model('roles', Role.schema);
    if (req.body.Id) {
      Role1.findOneAndUpdate({ Id: req.body.Id, Owner: owner }, req.body, { new: true }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        if (!user) {
          logger.error('No record found to update');
          conn.close();
          return res.status(422).send({ error: { statusCode: 422, message: 'No record found to update' } });
        }
        user = user.toObject();
        delete user._id;
        res.data = user;
        conn.close();
        return next();
      });
    } else {
      logger.error('No record found to update');
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  }
}

function deleteRole(req, res, next) {
  var conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;

  if (roleName == 'Registered' || roleName == 'Res') {
    var Role1 = conn.model('roles', Role.schema);
    Role1.remove({ Id: req.params.id }, function (err, user) {
      if (err) {
        logger.error(err);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'Role successfully deleted' };
      conn.close();
      return next();
    })
  } else {
    // if dont meet any above condition then owner can delete the record
    var Role1 = conn.model('roles', Role.schema);
    Role1.remove({ Id: req.params.id, Owner: owner }, function (err, user) {
      if (err) {
        logger.error(err);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'Role successfully deleted' };
      conn.close();
      return next();
    })
  }
}
