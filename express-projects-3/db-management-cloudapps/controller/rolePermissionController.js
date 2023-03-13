const RolePermission = require('../models/role_permissions');
var mongoose = require('mongoose');
const Role = require('../models/roles');
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
  createRolePermission,
  getAllRolePermissions,
  getRolePermissionById,
  updateRolePermission,
  deleteRolePermission
};

function createRolePermission(req, res, next) {
  //console.log(JSON.stringify(req.body));
  const db = req.database;
  const conn = req.connection;
  req.body.CreatedBy = req.user_id;
  req.body.ModifiedBy = req.user_id;
  req.body.Owner = req.user_id;

  if (req.body.RoleId) {
    var Role1 = conn.model('roles', Role.roleSchema);
    Role1.findOne({ Id: req.body.RoleId }, function (err, sRole1) {
      if (err) {
        logger.error(err);
        return res.status(500).send({ error: { statusCode: 500, message: error } });
      }
      if (!sRole1) {
        logger.error('No role record found');
        return res.status(422).send({ error: { statusCode: 422, message: 'No role record found' } });
      }
      var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
      var Role_permissions1 = new Role_permissions1(req.body);
      Role_permissions1.save(function (error, createdUser) {
        if (error) {
          conn.close();
          logger.error(error);
          return res.status(500).send({ error: { statusCode: 500, message: error } });
        }
        createdUser = createdUser.toObject();
        delete createdUser._id;
        res.data = createdUser;
        conn.close();
        return next();
      });
    });
  } else {
    logger.error('RoleId is required');
    return res.status(422).send({ error: { statusCode: 422, message: 'RoleId is required' } });
  }
}

function getAllRolePermissions(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;
  var filter = {};
  if (permissionObj == 'true') {

    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
    }
    var Role_permissions2 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions2.find(filter, { '_id': 0 }).then(user => {

      res.data = user;
      conn.close();
      next();
    }).catch(err => {
      logger.error(err);
      conn.close();
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    })
  } else {
    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
    }
    filter.Owner = owner;
    var Role_permissions2 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions2.find(filter, { '_id': 0 }).then(user => {
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

function getRolePermissionById(req, res, next) {
  let requestedId = req.params.id;
  console.log("requestedId: " + requestedId);
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;

  if (roleName == 'Registered' || roleName == 'Res') {
    var Role_permissions2 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions2.findOne({ Id: requestedId }, { '_id': 0 }).then(user => {
      if (!user) {
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
  } else {
    // final done by owner
    var Role_permissions2 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions2.findOne({ Id: requestedId, Owner: owner }, { '_id': 0 }).then(user => {
      if (!user) {
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

function updateRolePermission(req, res, next) {
  var db = req.database;
  var currentModel = req.model;
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
    var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    if (req.body.Id) {
      Role_permissions1.findOneAndUpdate({ Id: req.body.Id }, req.body, { new: true }, function (err, user) {
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
      logger.error('Id is required');
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  } else {
    // if dont meet any above condition then owner can update the record
    var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    if (req.body.Id) {
      Role_permissions1.findOneAndUpdate({ Id: req.body.Id, Owner: owner }, req.body, { new: true }, function (err, user) {
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
      })
    } else {
      logger.error('Id is required');
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  }
}

function deleteRolePermission(req, res, next) {
  //console.log("delete user");
  var db = req.database;
  var currentModel = req.model;
  var conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;

  if (roleName == 'Registered' || roleName == 'Res') {
    var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions1.remove({ Id: req.params.id }, function (err, user) {
      if (err) {
        logger.error(err);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        logger.error('No record found to delete');
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'role_permission successfully deleted' };
      logger.info(res.data);
      conn.close();
      return next();
    })
  } else {
    // if dont meet any above condition then owner can delete the record
    var Role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    Role_permissions1.remove({ Id: req.params.id, Owner: owner }, function (err, user) {
      if (err) {
        logger.error(err);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        logger.error('No record found to delete');
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'role_permission successfully deleted' };
      logger.info(res.data);
      conn.close();
      return next();
    })
  }
}
