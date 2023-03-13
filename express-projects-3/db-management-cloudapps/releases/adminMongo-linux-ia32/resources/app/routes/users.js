var express = require('express');
var router = express.Router();
var common = require('./common');
var uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');

// runs on all routes and checks password if one is setup
router.all('/users/*', common.checkLogin, function (req, res, next){
    next();
});

// Creates a new user
router.post('/users/:conn/:db/user_create', function (req, res, next){
    var connection_list = req.app.locals.dbConnections;

    // Check for existance of connection
    if(connection_list[req.params.conn] === undefined){
        res.status(400).json({'msg': req.i18n.__('Invalid connection')});
        return;
    }

    // Validate database name
    if(req.params.db.indexOf(' ') > -1){
        res.status(400).json({'msg': req.i18n.__('Invalid database name')});
    }

    // Get DB's form pool
    var mongo_db = connection_list[req.params.conn].native.db(req.params.db);
    bcrypt.genSalt(10, function (errr, salt) {
        bcrypt.hash(req.body.user_password, salt, function (err, hash) {
            if (err) return next('Password hashing failure');
            req.body.user_password = hash;
            var obj = {
                "Username": req.body.username,
                "Password": req.body.user_password,
                "updatedAt": new Date(),
                "createdAt": new Date(),
                "Role": req.body.roles,
                "IdentityProvider": "Cloudapps backend service",
                "Owner": "00000000-0000-0000-0000-000000000000",
                "ModifiedBy": "00000000-0000-0000-0000-000000000000",
                "CreatedBy": "00000000-0000-0000-0000-000000000000",
                "IsVerified": false,
                "Id": uuid()
            };

            // Add a user
            mongo_db.collection('users').save(obj, function (err, user_name) {
                if (err) {
                    console.error('Error creating user: ' + err);
                    res.status(400).json({'msg': req.i18n.__('Error creating user') + ': ' + err});
                } else {
                    res.status(200).json({'msg': req.i18n.__('User successfully created')});
                }
            });
        });
    });

});

// Deletes a user
router.post('/users/:conn/:db/user_delete', function (req, res, next){
    var connection_list = req.app.locals.dbConnections;

    // Check for existance of connection
    if(connection_list[req.params.conn] === undefined){
        res.status(400).json({'msg': req.i18n.__('Invalid connection')});
        return;
    }

    // Validate database name
    if(req.params.db.indexOf(' ') > -1){
        res.status(400).json({'msg': req.i18n.__('Invalid database name')});
    }

    // Get DB form pool
    var mongo_db = connection_list[req.params.conn].native.db(req.params.db);
    // remove a user
    mongo_db.collection('users').remove({Username: req.body.username},true, function (err, docs){
        if(err){
            console.error('Error deleting user: ' + err);
            res.status(400).json({'msg': req.i18n.__('Error deleting user') + ': ' + err});
        }else{
            res.status(200).json({'msg': req.i18n.__('User successfully deleted')});
        }
    });
});

module.exports = router;
