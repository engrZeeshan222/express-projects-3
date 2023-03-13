const RolePermission = require('../models/role_permissions');

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
  getRolePermissionById,
  updateRolePermission
};



function getRolePermissionById(req, res, next) {
  let requestedId = req.params.id;
  console.log("requestedId: " + requestedId);
  logger.info("requestedId: " + requestedId);

  const conn = req.connection;
  var Role_permissions2 = conn.model('role_permissions', RolePermission.schema);
  Role_permissions2.findOne({ Id: requestedId }, { '_id': 0 }).then(user => {
    if (!user) {
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

function updateRolePermission(req, res, next) {
  var conn = req.connection;

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

}
