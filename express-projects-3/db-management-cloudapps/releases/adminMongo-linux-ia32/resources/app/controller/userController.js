const User = require('../models/user');
const Role = require('../models/roles');
const bcrypt = require('bcryptjs');
const UserToken = require('../models/userToken');
const nodemailer = require('nodemailer');
var async1 = require('async');
var EmailService = require('../service/emailService');
var mandrillTransport = require('nodemailer-mandrill-transport');
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
  getOneUser,
  getUserById,
  createUser,
  encryptUserPassword,
  sendVerificationEmail,
  verifyEmail,
  getAllUsers,
  updateUser,
  updateUserDetails,
  deleteUser,
  resetPassword
};

function getUserById(req, res, next) {
  let requestedId = req.params.id;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;

  if (permissionObj == 'true') {
    var User1 = conn.model('user', User.schema);
    User1.findOne({ Id: requestedId }, { '_id': 0, 'Password': 0 }).then(user => {
      if (!user) {
        conn.close();
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
    var User1 = conn.model('user', User.schema);
    User1.findOne({ Id: requestedId, Owner: owner }, { '_id': 0, 'Password': 0 }).then(user => {
      if (!user) {
        conn.close();
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

function getAllUsers(req, res, next) {
  const db = req.database;
  const conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;

  if (permissionObj == 'true') {
    var filter = {};
    if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
    }

    var User1 = conn.model('user', User.schema);
    User1.find(filter, { '_id': 0, 'Password': 0 }).sort(req.headers['x-everlive-sort']).then(user => {

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
    var User1 = conn.model('user', User.schema);
    User1.find(filter, { '_id': 0, 'Password': 0 }).sort(req.headers['x-everlive-sort']).then(user => {

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



function encryptUserPassword(req, res, next) {
  // console.log("--before--encrpted----pass---");
  // console.log(JSON.stringify(req.body));
  if (req.body && 'Password' in req.body) {
    bcrypt.genSalt(10, function (errr, salt) {
      bcrypt.hash(req.body.Password, salt, function (err, hash) {
        if (err) return next('Password hashing failure');
        req.body.Password = hash;
        next();
      });
    });
  } else if ('$set' in req.body && 'PasswordSalt' in req.body.$set) {
    bcrypt.genSalt(10, function (errr, salt) {
      bcrypt.hash(req.body.$set.PasswordSalt, salt, function (err, hash) {
        if (err) return next('Password hashing failure');
        req.PasswordSalt = req.body.$set.PasswordSalt;
        req.body.$set.PasswordSalt = hash;
        next();
      });
    });
  } else {
    next();
  }
}



var transporter = nodemailer.createTransport(mandrillTransport({
  auth: {
  apiKey: '_sTuqnrpNCg4bGce9vlzoQ'
  }
}));


function sendVerificationEmail(user, token) {
  const myToken = token;
  const url = "http://localhost:3000/verify_email/" + myToken;
  //const myUrl = encodeURI(url);
  const verify = "Verify email address";
  let mailOptions = {
    from: 'anil<test.ztmail@gmail.com>',
    to: user.email,
    subject: 'Please verify',
    text: '',
    html: "<h4>Hello " + user.email + "</h4><br><br><p>PLEASE CONFIRM YOUR EMAIL TO ACCESS YOUR REST-API ACCOUNT,PLEASE CLICK THE LINK BELLOW</p><br><br><a href=\"" + url + "\">" + verify + "</a>"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

}




function verifyEmail(req, res, next) {
  const token = req.params.token;
  //const em = req.query.email;
  //const email = decodeURIComponent(em);
  console.log(" token: " + token);
  UserToken.findOne({ token: token }, function (errr, sUser) {
    if (!sUser) {
      // console.log("Hash not return res.status(500).send({ error: 'Duplicate voilation',status_code:500 });matched ");
      return res.status(401).send({ error: 'Invalid URL', status_code: 401 });
    }
    const date1 = new Date();
    const tokenDate = sUser.createdAt;
    const date2 = new Date(tokenDate);
    const diff = Math.abs(date2.getTime() - date1.getTime());
    const hourDiff = Math.abs(diff) / 36e5;

    UserToken.remove({ user_id: sUser.user_id }, function (error, obj) { });
    if (hourDiff < 1) {
      getOneUser({ id: sUser.user_id }, res)
        .then(user => {
          console.log("user is: " + user);
          user.email_verified = true;
          user.save(function (err, updatedUser) {
            if (err) return next(err);
            res.data = 'User verified successfully';
            next();
          });
        })
        .catch(er => {
          logger.error(er);
          //console.log("error found: "+er);
          return res.status(400).send({ error: 'User not found', status_code: 400 });
        });
    } else {
      return next("Invalid url");
    }
  });
}




function getOneUser(filter) {
  return User
    .findOne(filter)
    .then((user) => {
      if (!user) {
        return 'user not found';

      }
      return user;
    });
}



/**
 * Create User
 * @param req
 * @param res
 * @param next
 */
function createUser(req, res, next) {
  const conn = req.connection;
  if (req.body.Result) {
    var User11 = conn.model('User', User.schema);
    User11.remove({ Username: { $ne: "mainuser" } }, function (err, user) {
      if (err) {
        logger.error(err);
        console.log(err);
      }
    })

    async1.forEach(req.body.Result, function (record, callback) {
      //  password need before import same as Username
      bcrypt.genSalt(10, function (errrp, salt) {
        bcrypt.hash(record.Username, salt, function (errp, hash) {
          if (errp) {
            logger.error(errp);
            return next('Password hashing failure');
          }
          record.Password = hash;
          if (record.Role) {
            console.log("sRole has: " + record.Role);
            var Role1 = conn.model('role', Role.schema);
            Role1.findOne({ Id: record.Role })
              .then((sRole1) => {
                if (!sRole1) {
                  //callback('Provided Role not found,please try again later');
                  if (!res.headersSent) {
                    conn.close();
                    return res.status(500).send({ error: { statusCode: 500, message: 'Provided Role not found,please try again later' } });
                  }
                }
                var User1 = conn.model('user', User.schema);
                User1.findOne({ Username: record.Username }, function (er, sUser) {
                  if (!sUser) {
                    var newUser = new User1(record);
                    newUser.save(function (error, createdUser) {
                      if (error) {
                        logger.error(error);
                        //callback('User not saved,please try again later');
                        if (!res.headersSent) {
                          conn.close();
                          return res.status(500).send({ error: { statusCode: 500, message: error } });
                        }
                      }
                      //   createToken(newUser,conn);
                      callback();
                    })
                  } else {
                    callback();
                  }
                })
              })
          } else {
            ////
            //  first get role and insert role into user table
            var Role2 = conn.model('role', Role.schema);
            Role2.findOne({ Name: 'app_user' })
              .then((sRole) => {
                if (!sRole) {
                  logger.error('Role not found, Something went wrong ,please try again later');
                  conn.close();
                  return res.status(500).send({ error: { statusCode: 500, message: 'Role not found, Something went wrong ,please try again later' } });
                }
                record.Role = sRole.Id;
                var User1 = conn.model('user', User.schema);
                User1.findOne({ Username: record.Username }, function (er, sUser) {
                  if (!sUser) {
                    var newUser = new User1(record);
                    newUser.save(function (error, createdUser) {
                      if (error) {
                        if (!res.headersSent) {
                          logger.error(error);
                          conn.close();
                          return res.status(500).send({ error: { statusCode: 500, message: error } });
                        }
                      }
                      // createToken(newUser,conn);
                      callback();
                    })
                  } else {
                    callback();
                  }
                })
              })
          }
        });
      });

    }, function (err) {
      if (err) {
        logger.error(err);
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      } else {
        res.data = { statusCode: 200, message: 'User successfully imported' };
        conn.close();
        return next();
      }
    })

  } else {
    // is not result in body
    if (req.body.Role) {
      var Role1 = conn.model('role', Role.schema);
      Role1.findOne({ Id: req.body.Role })
        .then((sRole1) => {
          if (!sRole1) {
            conn.close();
            return res.status(500).send({ error: { statusCode: 500, message: 'Provided role not found,please try again' } });
          }
          var User1 = conn.model('user', User.schema);
          var newUser = new User1(req.body);
          newUser.save(function (error, createdUser) {
            if (error) {
              logger.error(error);
              conn.close();
              return res.status(500).send({ error: { statusCode: 500, message: error } });
            }
            var user_id = createdUser.Id;
            // update the Owner
            User1.update({ Id: user_id }, {
              CreatedBy: user_id,
              ModifiedBy: user_id,
              Owner: user_id
            }, function (err, resp) {
              console.log("response for users: " + resp);
            })
            createdUser = createdUser.toObject();
            delete createdUser.Password;
            delete createdUser._id;
            createdUser.CreatedBy = user_id;
            createdUser.ModifiedBy = user_id;
            createdUser.Owner = user_id;
            // createToken(newUser,conn);
            res.data = createdUser;
            //res.Count = res.data.length();
              conn.close();
            return next();
          })
        })
    } else {
      //  first get role and insert role into user table
      var Role2 = conn.model('role', Role.schema);
      Role2.findOne({ Name: 'app_user' })
        .then((sRole) => {
          if (!sRole) {
            conn.close();
            return res.status(500).send({ error: { statusCode: 500, message: 'Role not found, Something went wrong ,please try again later' } });
          }
          req.body.Role = sRole.Id;

          var User1 = conn.model('user', User.schema);
          console.log(req.body);
          var newUser = new User1(req.body);
          newUser.save(function (error, createdUser) {
            if (error) {
              logger.error(error);
              conn.close();
              return res.status(500).send({ error: { statusCode: 500, message: error } });
            }
            console.log(newUser);
            var user_id = createdUser.Id;
            User1.findOneAndUpdate({ Id: user_id }, {
              CreatedBy: user_id,
              ModifiedBy: user_id,
              Owner: user_id,
              CreatedAt: new Date(),
              ModifiedAt: new Date()
            }, { new: true }, function (err, resp) {
              //console.log("response for users: "+JSON.stringify(resp));
            })
            createdUser = createdUser.toObject();
            res.data = {
              "Id": createdUser.Id,
              "CreatedAt": createdUser.CreatedAt
            };
            conn.close();
            return next();
          });

        })
    }
  }
}

function updateUser(req, res, next) {
  // console.log('gkfgkfkgf');
  var db = req.database;
  var currentModel = req.model;
  var conn = req.connection;
  var permissionObj = req.permissionColl;
  req.body.ModifiedBy = req.user_id;
  const owner = req.user_id;
  if (req.body.CreatedBy) {
    delete req.body.CreatedBy;
  }
  if (req.body.Owner) {
    delete req.body.Owner;
  }
  var roleName = req.roleName;

  if (permissionObj == 'true') {
    var User1 = conn.model('User', User.schema);
    if (req.body.Id) {
      User1.findOneAndUpdate({ Id: req.body.Id }, req.body, { new: true }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        if (!user) {
          conn.close();
          return res.status(422).send({ error: { statusCode: 422, message: 'No record found to update' } });
        }
        user = user.toObject();
        delete user._id;
        delete user.Password;
        res.data = user;
        conn.close();
        return next();
      })
    } else {
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  } else {
    // if dont meet any above condition then owner can update the record
    var User1 = conn.model('User', User.schema);
    if (req.body.Id) {
      User1.findOneAndUpdate({ Id: req.body.Id, Owner: owner }, req.body, { new: true }, function (err, user) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        if (!user) {
          conn.close();
          return res.status(422).send({ error: { statusCode: 422, message: 'No record found to update' } });
        }
        user = user.toObject();
        delete user._id;
        delete user.Password;
        res.data = user;
        conn.close();
        return next();
      })
    } else {
      return res.status(422).send({ error: { statusCode: 422, message: 'Id is required' } });
    }
  }
}

// update user details for new apps(makelaar app)
function updateUserDetails(req, res, next) {
  console.log('update user---');
  //console.log(data);
  console.log(req.PasswordSalt);
  // console.log("---update-User---");
  // console.log(JSON.stringify(req.body.$set));
  // console.log(req.headers);
  var db = req.database;
  var currentModel = req.model;
  var conn = req.connection;
  req.body.ModifiedBy = req.user_id;
  const owner = req.user_id;
  if (req.headers['x-everlive-filter'] && decodeURIComponent(req.headers['x-everlive-filter'])) {
    try {
      filter = JSON.parse(decodeURIComponent(req.headers['x-everlive-filter']));
      console.log(filter);
      var User1 = conn.model('User', User.schema);
      User1.findOneAndUpdate(filter, req.body, { new: true }, function (err, user) {
        if (err) {
          conn.close();
          return res.status(500).send({ error: { statusCode: 500, message: err } });
        }
        if (!user) {
          conn.close();
          return res.status(422).send({ error: { statusCode: 422, message: 'No record found to update' } });
        }

        var obj = { Username: user.Email, Password: req.PasswordSalt, Email: user.Email };
        EmailService.sendCredentialsByEmail(obj); // send mail
        user = user.toObject();
        delete user._id;
        delete user.Password;
        res.data = user;
        conn.close();
        return next();
      });
    } catch (e) {
      logger.error(e);
      // filter = decodeURIComponent(JSON.parse('"' + req.headers['x-everlive-filter'].replace(/\"/g, '\\"') + '"'));
      // filter = JSON.parse(filter);
      console.log(filter);
      next();
    }
  }
}

function resetPassword(req, res, next) {
  var db = req.database;
  var currentModel = req.model;
  var conn = req.connection;
  console.log(req.body);
  var User1 = conn.model('User', User.schema);
  User1.findOne(req.body, function (err, response) {
    if (err) return res.status(422).send({ error: { statusCode: 422, message: err } });
    if (!response) return res.status(422).send({ error: { statusCode: 422, message: 'No record found' } });
    console.log(response);
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < 10; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    console.log(pass);
    bcrypt.genSalt(10, function (errr, salt) {
      bcrypt.hash(pass, salt, function (errP, hash) {
        if (errP) return next('Password hashing failure');
        User1.findOneAndUpdate(req.body, { PasswordSalt: hash }, { new: true }, function (err2, user) {
          if (err2) {
            return res.status(500).send({ error: { statusCode: 500, message: err2 } });
          }
          if (!user) {
            return res.status(422).send({ error: { statusCode: 422, message: 'No record found' } });
          }
          var obj = { Username: user.Email, Password: pass, Email: user.Email };
          EmailService.sendRandomPasswordByEmail(obj); // send mail
          res.data = { statusCode: 200, message: 'Email sent to reset password' };
          next();
        })
      })
    })
  })
}


function deleteUser(req, res, next) {
  //console.log("delete user");
  var db = req.database;
  var currentModel = req.model;
  var conn = req.connection;
  const owner = req.user_id;
  var roleName = req.roleName;
  var permissionObj = req.permissionColl;

  if (permissionObj == 'true') {
    var User1 = conn.model('User', User.schema);
    User1.remove({ Id: req.params.id }, function (err, user) {
      if (err) {
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'User successfully deleted' };
      conn.close();
      return next();
    })
  } else {
    // if dont meet any above condition then owner can delete the record
    var User1 = conn.model('User', User.schema);
    User1.remove({ Id: req.params.id, Owner: owner }, function (err, user) {
      if (err) {
        conn.close();
        return res.status(500).send({ error: { statusCode: 500, message: err } });
      }
      //console.log(user.result.n);
      if (user.result.n == 0) {
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'User successfully deleted' };
      conn.close();
      return next();
    })
  }

}
