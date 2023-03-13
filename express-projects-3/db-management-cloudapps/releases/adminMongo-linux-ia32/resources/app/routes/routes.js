var UserController = require('../controller/userController');
var AuthController = require('../controller/authController');
var RolesController = require('../controller/rolesController');
var RolePermissionController = require('../controller/rolePermissionController');
var verifyToken = require('../middleware/jwt-auth');
var batchJobAuth = require('../middleware/batch-job-auth');
var AdminverifyToken = require('../middleware/adminVerifyToken');
var AdminRolePermissionController = require('../controller/adminRolePermissionController');
var permissionChecker = require('../middleware/permissionChecker');
// maincontroller
var MainController = require('../controller/mainController');
var VThreeController = require('../controller/vThreeController');
var vZeroController = require('../controller/vZeroController');

var rolesMigration = require('../middleware/rolesMigrate');
var autoMigration = require('../middleware/automigrate');

//nextens controller
var NextensController = require('../controller/nextensController');
var verifyNextensToken = require('../middleware/verifyNextensToken');

//test controller
var testServer = require('../controller/testServer');
var verifyDbPin = require('../controller/verifyDbPin');
var createPdf = require('../controller/createPdf');

module.exports = function routes(server) {
  server.get('/', function (req, res) {
    res.redirect(req.app_context + '/app');
  });

  const baseURL = '/v1/:db/:collection';

  //TEST API
  server.get('/test/server', testServer.testServer, genericResponse);
  // Verify DB PIN API
  server.get('/v1/verifydbpin/:db', verifyDbPin.verifyPin, genericResponse);
  //server.post('/v1/createPdf', createPdf.createpdf, genericResponse);
  // NOTIFICATIONS API
  server.get('/v1/:db/notifications', verifyToken, permissionChecker, MainController.getNotifications, genericResponse);
  server.delete('/v1/batch/delete/notifications', batchJobAuth, MainController.deleteNotifications, genericResponse);

  server.post(baseURL + '/token', rolesMigration, autoMigration, AuthController.login, genericResponse);
  server.get(baseURL + '/logout', AuthController.logout, genericResponse);
  // create collection dynamically by UI
  server.post('/v1/:db/admin/coll_create', AdminverifyToken, MainController.createCollectionDynamic, genericResponse);
  server.delete('/v1/:db/admin/coll_delete', AdminverifyToken, MainController.deleteCollectionDynamic, genericResponse);

  // RolePermissions APIs for admin only
  server.get('/v1/:db/admin/role_permissions/:id', AdminverifyToken, AdminRolePermissionController.getRolePermissionById, genericResponse);
  server.put('/v1/:db/admin/role_permissions', AdminverifyToken, AdminRolePermissionController.updateRolePermission, genericResponse);
  // create collection dynamically by admin only
  server.post('/v1/:db/admin/create_collection', verifyToken, MainController.createCollectionDynamic, genericResponse);

  server.post('/v1/:db/users', UserController.encryptUserPassword, UserController.createUser, genericResponse);
  server.get('/v1/:db/users', verifyToken, permissionChecker, UserController.getAllUsers, genericResponse);
  server.get('/v1/:db/users/:id', verifyToken, permissionChecker, UserController.getUserById, genericResponse);
  server.put('/v1/:db/users', verifyToken, permissionChecker, UserController.encryptUserPassword, UserController.updateUser, genericResponse);
  server.delete('/v1/:db/users/:id', verifyToken, permissionChecker, UserController.deleteUser, genericResponse);

  // roles APIs RolePermissionController
  server.post('/v1/:db/roles', verifyToken, permissionChecker, RolesController.createRole, genericResponse);
  server.get('/v1/:db/roles', verifyToken, permissionChecker, RolesController.getAllRoles, genericResponse);
  server.get('/v1/:db/roles/:id', verifyToken, permissionChecker, RolesController.getRoleById, genericResponse);
  server.put('/v1/:db/roles', verifyToken, permissionChecker, RolesController.updateRole, genericResponse);
  server.delete('/v1/:db/roles/:id', verifyToken, permissionChecker, RolesController.deleteRole, genericResponse);

  // RolePermissions APIs
  server.post('/v1/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.createRolePermission, genericResponse);
  server.get('/v1/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.getAllRolePermissions, genericResponse);
  server.get('/v1/:db/role_permissions/:id', verifyToken, permissionChecker, RolePermissionController.getRolePermissionById, genericResponse);
  server.put('/v1/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.updateRolePermission, genericResponse);
  server.delete('/v1/:db/role_permissions/:id', verifyToken, permissionChecker, RolePermissionController.deleteRolePermission, genericResponse);

  // APIs for nextens soap request used by only admin(not nextens)
  server.post('/v1/nextens/oauth', NextensController.authenticateUser, genericResponse);
  server.get('/v1/nextens/oauth', verifyNextensToken, NextensController.getUser, genericResponse);
  server.post('/v1/nextens/oauth/reset-password', verifyNextensToken, NextensController.resetPassword, genericResponse);
  server.get('/v1/nextens/soap', verifyNextensToken, NextensController.getStatus, genericResponse);
  server.put('/v1/nextens/soap', verifyNextensToken, NextensController.updateStatus, genericResponse);
  server.delete('/v1/nextens/soap', verifyNextensToken, NextensController.deleteStatus, genericResponse);

  // all models APIs
  server.post(baseURL, verifyToken, permissionChecker, MainController.createRecord, genericResponse);
  server.get(baseURL, verifyToken, permissionChecker, MainController.getAllRecord, genericResponse);
  server.get(baseURL + '/:id', verifyToken, permissionChecker, MainController.getRecordrById, genericResponse);
  server.put(baseURL, verifyToken, permissionChecker, MainController.updateRecord, genericResponse);
  server.delete(baseURL + '/:id', verifyToken, permissionChecker, MainController.deleteRecord, genericResponse);
  server.delete(baseURL + '/remove/fields', verifyToken, permissionChecker, MainController.deletefieldsFromCollection, genericResponse);
  server.delete(baseURL + '/delete/collection', verifyToken, permissionChecker, MainController.deleteAllDataFromCollection, genericResponse);

  // below APIs for v2
  server.put(baseURL + '/:id', verifyToken, permissionChecker, MainController.updateRecordById, genericResponse);
  server.get(baseURL + '/SetOwnerForApp_user', MainController.getOwner);

  // v0 template open database APIs:
  const v0baseURL = '/v0/:db/:collection';
  server.post(v0baseURL + '/token', rolesMigration, autoMigration, AuthController.login, genericResponse);
  server.get(v0baseURL + '/logout', AuthController.logout, genericResponse);

  server.post('/v0/:db/users', UserController.encryptUserPassword, UserController.createUser, genericResponse);
  server.get('/v0/:db/users', UserController.getAllUsers, genericResponse);
  server.get('/v0/:db/users/:id', UserController.getUserById, genericResponse);
  server.put('/v0/:db/users', UserController.encryptUserPassword, UserController.updateUser, genericResponse);
  server.delete('/v0/:db/users/:id', UserController.deleteUser, genericResponse);

  // roles APIs RolePermissionController
  server.post('/v0/:db/roles', RolesController.createRole, genericResponse);
  server.get('/v0/:db/roles', RolesController.getAllRoles, genericResponse);
  server.get('/v0/:db/roles/:id', RolesController.getRoleById, genericResponse);
  server.put('/v0/:db/roles', RolesController.updateRole, genericResponse);
  server.delete('/v0/:db/roles/:id', RolesController.deleteRole, genericResponse);

  // RolePermissions APIs
  server.post('/v0/:db/role_permissions', RolePermissionController.createRolePermission, genericResponse);
  server.get('/v0/:db/role_permissions', RolePermissionController.getAllRolePermissions, genericResponse);
  server.get('/v0/:db/role_permissions/:id', RolePermissionController.getRolePermissionById, genericResponse);
  server.put('/v0/:db/role_permissions', RolePermissionController.updateRolePermission, genericResponse);
  server.delete('/v0/:db/role_permissions/:id', RolePermissionController.deleteRolePermission, genericResponse);

  // all models APIs
  server.post(v0baseURL, vZeroController.createRecord, genericResponse);
  server.get(v0baseURL, vZeroController.getAllRecord, genericResponse);
  server.get(v0baseURL + '/:id', vZeroController.getRecordrById, genericResponse);
  server.put(v0baseURL, vZeroController.updateRecord, genericResponse);
  server.put(v0baseURL + '/:id', vZeroController.updateRecordById, genericResponse);
  server.delete(v0baseURL + '/:id', vZeroController.deleteRecord, genericResponse);
  server.delete(v0baseURL + '/remove/fields', vZeroController.deletefieldsFromCollection, genericResponse);
  server.delete(v0baseURL + '/delete/collection', verifyToken, vZeroController.deleteAllDataFromCollection, genericResponse);
  // v3 new template(makelaar app) APIs:
  const v3baseURL = '/v3/:db/:collection';
  server.post(v3baseURL + '/token', rolesMigration, autoMigration, AuthController.newLoginFun, genericResponse);
  server.get(v3baseURL + '/logout', AuthController.logout, genericResponse);

  server.post('/v3/:db/users', UserController.encryptUserPassword, UserController.createUser, genericResponse);
  server.get('/v3/:db/users', verifyToken, permissionChecker, UserController.getAllUsers, genericResponse);
  server.get('/v3/:db/users/:id', verifyToken, permissionChecker, UserController.getUserById, genericResponse);
  server.put('/v3/:db/users', verifyToken, permissionChecker, UserController.encryptUserPassword, UserController.updateUserDetails, genericResponse);
  server.delete('/v3/:db/users/:id', verifyToken, permissionChecker, UserController.deleteUser, genericResponse);

  // reset password APIs
  server.post('/v3/:db/users/resetpassword', UserController.resetPassword, genericResponse);

  // roles APIs RolePermissionController
  server.post('/v3/:db/roles', verifyToken, permissionChecker, RolesController.createRole, genericResponse);
  server.get('/v3/:db/roles', verifyToken, permissionChecker, RolesController.getAllRoles, genericResponse);
  server.get('/v3/:db/roles/:id', verifyToken, permissionChecker, RolesController.getRoleById, genericResponse);
  server.put('/v3/:db/roles', verifyToken, permissionChecker, RolesController.updateRole, genericResponse);
  server.delete('/v3/:db/roles/:id', verifyToken, permissionChecker, RolesController.deleteRole, genericResponse);

  // RolePermissions APIs
  server.post('/v3/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.createRolePermission, genericResponse);
  server.get('/v3/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.getAllRolePermissions, genericResponse);
  server.get('/v3/:db/role_permissions/:id', verifyToken, permissionChecker, RolePermissionController.getRolePermissionById, genericResponse);
  server.put('/v3/:db/role_permissions', verifyToken, permissionChecker, RolePermissionController.updateRolePermission, genericResponse);
  server.delete('/v3/:db/role_permissions/:id', verifyToken, permissionChecker, RolePermissionController.deleteRolePermission, genericResponse);

  // all models APIs
  server.post(v3baseURL, verifyToken, permissionChecker, VThreeController.createRecord, genericResponse);
  server.get(v3baseURL, verifyToken, permissionChecker, VThreeController.getAllRecord, genericResponse);
  server.get(v3baseURL + '/:id', verifyToken, permissionChecker, VThreeController.getRecordrById, genericResponse);
  server.put(v3baseURL, verifyToken, permissionChecker, VThreeController.updateRecord, genericResponse);
  server.put(v3baseURL + '/:id', verifyToken, permissionChecker, VThreeController.updateRecordById, genericResponse);
  server.delete(v3baseURL + '/:id', verifyToken, permissionChecker, VThreeController.deleteRecord, genericResponse);
  server.delete(v3baseURL + '/remove/fields', verifyToken, permissionChecker, VThreeController.deletefieldsFromCollection, genericResponse);
}

//module.exports = router;

function genericResponse(req, res) {
  var count = 0, response;
  if (res.data && res.data.length >= 0) {
    count = res.data.length;
    response = { Count: count, Result: res.data };
  } else if (res.data && res.data.Result) {
    response = res.data
  } else {
    response = { Result: res.data };
  }

  if (res.pagination) {
    response.pagination = res.pagination;
  }
  res.send(response);
}
