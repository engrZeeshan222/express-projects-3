const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var config = require('../config/database');

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
  login,
  newLoginFun,
  logout
};

function login(req, res, next) {
  var email = req.body.Email;
  var username = req.body.Username || req.body.username;
  var password = req.body.Password || req.body.password;
  var filter;

  const conn = req.connection;
  
  if (email) {
    filter = { Email: email };
  }

  // if (username) {
  //   var filter = { Username: username };
  // }

  if (username) {
    if (req.headers['is-case-sensitive'] == "true" || req.headers['is-case-sensitive'] == true) {
      filter = { Username: { $regex: new RegExp(`^${username}$`, 'i') } };
    } else {
      filter = { Username: username };
    }
  }

  var User1 = conn.model('user', User.userSchema);
  User1.findOne(filter, { '_id': 0 }, function (err, user) {
    if (err) {
      logger.error(err);
      conn.close();
      return res.status(401).send({ error: 'Username/Email OR Password not matched', statusCode: 401 });
    }
    if (!user) {
      logger.error('User not found,please try again later');
      conn.close();
      return res.status(401).send({ error: 'User not found,please try again later', statusCode: 401 });
    }
    bcrypt.compare(password, user.Password, function (err, isMatched) {
      if (err) {
        logger.error('Unauthorized user');
        return res.status(401).send({ error: { message: 'Unauthorized user', statusCode: 401 } });
      }
      if (isMatched) {
        suser = user.toObject();
        delete suser.Password;
        var token = jwt.sign({ user: suser }, config.secret, {
          expiresIn: '24h',  // 60m //365d
          algorithm: 'HS256'
        });
        var obj = {};
        obj.access_token = token;
        obj.token_type = 'bearer';
        obj.principal_id = suser.Id;
        res.data = obj;
        conn.close(); // uncommented by Piyush 20 Feb 2018
        next();
      } else {
        logger.error('Password not matched');
        conn.close();
        res.status(401).send({ error: 'Password not matched', statusCode: 401 });
      }
    });
  });

}

function newLoginFun(req, res, next) {
  var username = req.body.Username || req.body.username;
  var password = req.body.Password || req.body.password;
  const conn = req.connection;
  var User1 = conn.model('user', User.userSchema);
  User1.findOne({ Username: username }, { '_id': 0 }, function (err, user) {
    if (err) {
      logger.error(err);
      conn.close();
      return res.status(400).send({ error: 'Username/Email OR Password not matched', statusCode: 400 });
    }
    if (!user) {
      User1.findOne({ Email: username }, { '_id': 0 }, function (err1, user1) {
        if (err1) {
          logger.error(err1);
          conn.close();
          return res.status(400).send({ error: 'Username/Email OR Password not matched', statusCode: 400 });
        }
        if (!user1) {
          logger.error('User not found,please try again later');
          conn.close();
          return res.status(400).send({ error: 'User not found,please try again later', statusCode: 400 });
        }
        bcrypt.compare(password, user1.PasswordSalt, function (err, isMatched) {
          if (err) {
            logger.error(err);
            return res.status(401).send({ error: { message: 'Unauthorized user', statusCode: 401 } });
          }
          if (isMatched) {
            suser = user1.toObject();
            delete suser.Password;
            // delete suser._id;
            var token = jwt.sign({ user: suser }, config.secret, {
              expiresIn: '24h',  // 60m //365d
              algorithm: 'HS256'
            });
            // res.data = [{sucess:true,user:suser,token:'Bearer '+token}];
            var obj = {};
            obj.access_token = token;
            obj.token_type = 'bearer';
            obj.principal_id = suser.Id;
            res.data = obj;
            conn.close();
            next();
          } else {
            logger.error('Password not matched');
            conn.close();
            res.status(400).send({ error: 'Password not matched', statusCode: 400 });
          }
        });
      })
    } else {
      bcrypt.compare(password, user.Password, function (err, isMatched) {
        if (err) {
          logger.error(err);
          conn.close();
          return res.status(401).send({ error: { message: 'Unauthorized user', statusCode: 401 } });
        }
        if (isMatched) {
          suser = user.toObject();
          delete suser.Password;
          // delete suser._id;
          var token = jwt.sign({ user: suser }, config.secret, {
            expiresIn: '24h',  // 60m //365d
            algorithm: 'HS256'
          });
          // res.data = [{sucess:true,user:suser,token:'Bearer '+token}];
          var obj = {};
          obj.access_token = token;
          obj.token_type = 'bearer';
          obj.principal_id = suser.Id;
          res.data = obj;
          conn.close();
          next();
        } else {
          logger.error('Password not matched');
          conn.close();
          res.status(400).send({ error: 'Password not matched', statusCode: 400 });
        }
      });
    }
  })

}

function logout(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, config.secret, function (err, decoded) {
      if (err) { //failed verification.
        res.data = 'user logout successfully';
        next();
        return;
      }
      res.data = "something went wrong, user is not logged out";
      logger.error(res.data);
      next();

    });
  } else {
    res.data = "token is not present";
    logger.error(res.data);
    next();
  }
}
