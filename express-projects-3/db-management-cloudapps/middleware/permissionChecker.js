
const Role = require('../models/roles');
const RolePermission = require('../models/role_permissions');

module.exports = function (req, res, next) {
  var userRole = req.userRole;
  var methodType = req.methodType;
  var conn = req.connection;
  var Role1 = conn.model('roles', Role.schema);
  Role1.findOne({ Id: userRole }, function (error, sRole) {
    if (error) {
      conn.close();
      return res.status(401).send({ error: { statusCode: 401, message: 'Permission denied,You are not authorized user' } });
    }
    if (!sRole) {
      conn.close();
      return res.status(401).send({ error: { statusCode: 401, message: 'Permission denied,You are not authorized user' } });
      // return res.status(401).send('This token is not for this db');
    }
    var table1 = req.model;
    var RolePermission1 = conn.model('role_permissions', RolePermission.schema);
    RolePermission1.findOne({ RoleId: userRole }, function (error, sRolePermission) {
      if (error) {
        console.log(error)
      }
      if (!sRolePermission) {
        conn.close();
        return res.status(401).send({
          error: {
            statusCode: 401,
            message: 'Permission denied,You are not authorized user'
          }
        });
      }
      req.roleName = sRole.Name;
      var permissionObj = sRolePermission.permission[table1];
      if (permissionObj) {
        var read = JSON.stringify(permissionObj.read);
        var update = JSON.stringify(permissionObj.update);
        var delete1 = JSON.stringify(permissionObj.delete);
        var create = JSON.stringify(permissionObj.create);
        if (methodType == 'POST' && create == 'true') {
          req.permissionColl = 'true';
          if (!res.headersSent) {
            //  console.log('headersSent' + res.headersSent);
            return next();
          }
        }
        if (methodType == 'POST' && create == 'false') {
          if (!res.headersSent) {
            conn.close();
            return res.status(403).send({ error: { statusCode: 403, message: 'Permission denied,You are not authorized user' } });
          }
        }
        if (methodType == 'GET' && read == 'true') {
          req.permissionColl = 'true';
          if (!res.headersSent) {
            //console.log('headersSent' + res.headersSent);
            return next();
          }
        } else if (methodType == 'PUT' && update == 'true') {
          req.permissionColl = 'true';
          if (!res.headersSent) {
            //console.log('headersSent' + res.headersSent);
            return next();
          }
        } else if (methodType == 'DELETE' && delete1 == 'true') {
          req.permissionColl = 'true';
          if (!res.headersSent) {
            //console.log('headersSent' + res.headersSent);
            return next();
          }
        } else {
          req.permissionColl = 'false';
          if (!res.headersSent) {
            //console.log('headersSent' + res.headersSent);
            return next();
          }
        }
      } else {
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: "Collection not found" } });
      }
    });
  });
}
