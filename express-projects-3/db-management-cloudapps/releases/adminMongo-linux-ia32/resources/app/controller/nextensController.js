var MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var config = require('../config/database');
var uuid = require('uuid/v4');
const jwtBlacklist = require('jwt-blacklist')(jwt);
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
  authenticateUser,
  getStatus,
  updateStatus,
  deleteStatus,
  resetPassword,
  getUser
};

function authenticateUser(req, res, next) {
  var database = 'nextens';
  var username = req.body.username || req.body.Username;
  var password = req.body.password || req.body.Password;
  var obj = { id: uuid(), username: 'nextensuser', password: '' };

  MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
    db.collection("oauth").findOne({}, function (mongoErr, result) {
      logger.info(result);
      if (!result) {
        console.log("inside if---");
        //return res.status(404).send({error:{ statusCode:404,message:'Not found'}});
        bcrypt.genSalt(10, function (errrp, salt) {
          bcrypt.hash(obj.username, salt, function (errp, hash) {
            if (errp) {
              logger.error(errp);
              db.close();
              return next('Password hashing failure');
            }
            obj.password = hash;
            //insert the record into the user collection
            db.collection("oauth").insert(obj, function (mongoErrr, user) {
              logger.info(user);
              // now compare the credentials
              db.collection("oauth").findOne({ username: username }, function (mongoErr2, result2) {
                if (mongoErr2) {
                  logger.error(mongoErr2);
                  db.close();
                  return res.status(400).send({ error: 'username OR password not matched', statusCode: 400 });
                }
                if (!result2) {
                  logger.error('User not found,please try again later');
                  db.close();
                  return res.status(400).send({ error: 'User not found,please try again later', statusCode: 400 });
                }
                bcrypt.compare(password, result2.password, function (err, isMatched) {
                  if (err) {
                    db.close();
                    return res.status(401).send({ error: { message: 'Unauthorized user', statusCode: 401 } });
                  }
                  if (isMatched) {
                    suser = result2;
                    delete suser.Password;
                    // delete suser._id;
                    var token = jwt.sign({ nextensUser: suser }, config.nextensSecret, {
                      expiresIn: '24h',  // 60m //365d
                      algorithm: 'HS256'
                    });
                    // res.data = [{sucess:true,user:suser,token:'Bearer '+token}];
                    var obj2 = {};
                    obj2.access_token = token;
                    obj2.token_type = 'bearer';
                    obj2.principal_id = suser.id;
                    res.data = obj2;
                    db.close();
                    return next();
                  }
                })
              })
            })
          })
        })

      } else {

        db.collection("oauth").findOne({ username: username }, function (mongoErr2, result2) {
          if (mongoErr2) {
            logger.error('username OR password not matched');
            db.close();
            return res.status(400).send({ error: 'username OR password not matched', statusCode: 400 });
          }
          if (!result2) {
            logger.error('User not found,please try again later');
            db.close();
            return res.status(400).send({ error: 'User not found,please try again later', statusCode: 400 });
          }
          bcrypt.compare(password, result2.password, function (err, isMatched) {
            if (err) {
              logger.error(err);
              db.close();
              return res.status(401).send({ error: { message: 'Unauthorized user', statusCode: 401 } });
            }
            if (isMatched) {
              suser = result2;
              delete suser.Password;
              // delete suser._id;
              var token = jwt.sign({ nextensUser: suser }, config.nextensSecret, {
                expiresIn: '24h',  // 60m //365d
                algorithm: 'HS256'
              });
              // res.data = [{sucess:true,user:suser,token:'Bearer '+token}];
              var obj2 = {};
              obj2.access_token = token;
              obj2.token_type = 'bearer';
              obj2.principal_id = suser.id;
              res.data = obj2;
              db.close();
              return next();
            }
          })
        })
      }
    })
  })
}

function resetPassword(req, res, next) {
  const conn = req.connection;

  var obj = { username: 'nextensuser', password: '' };
  if (req.query.id) {
    bcrypt.genSalt(10, function (errrp, salt) {
      bcrypt.hash(req.body.password || req.body.Password, salt, function (errp, hash) {
        if (errp) {
          logger.error(errp);
          return next('Password hashing failure');
        }
        obj.password = hash;
        if ('username' in req.body || 'Username' in req.body) {
          obj.username = req.body.username || req.body.Username;
        }
        conn.db.collection("oauth").findOneAndUpdate({ id: req.query.id }, { $set: obj }, { returnOriginal: false }, function (err, result) {
          if (err) {
            conn.close();
            return res.status(500).send(err);
          }
          if (result.value == null) {
            res.data = result.value;
            conn.close();
            logger.error('Password is not updated, please try later');
            return res.status(500).send({ error: { statusCode: 500, message: 'Password is not updated, please try later' } });
          } else {
            delete result.value._id;
            res.data = result.value;
            conn.close();
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
              const bearer = bearerHeader.split(" ");
              const bearerToken = bearer[1];
              jwtBlacklist.blacklist(bearerToken);
              jwt.verify(bearerToken, config.nextensSecret, function (err, decoded) {
                if (err) { //failed verification.
                  logger.error(err);
                  return res.status(200).send({ success: { statusCode: 200, message: 'Password has been updated successfully,please login to continue' } });
                  //  return res.json({"error": err});
                }
                logger.error('Something went wrong,password is not updated');
                return res.status(500).send({ error: { statusCode: 500, message: 'Something went wrong,password is not updated' } });

              });
            }

          }

        })
      })
    })
  } else {
    logger.error('id is required');
    return res.status(422).send({ error: { statusCode: 422, message: 'id is required' } });
  }
}

function getUser(req, res, next) {
  const conn = req.connection;
  conn.db.collection("oauth").find({}).toArray(function (err, result) {
    if (err) {
        conn.close();
        return res.status(500).send(err);
    }
    delete result[0]._id;
    res.data = result;
    conn.close();
    next();
  })
}


function getStatus(req, res, next) {
  const conn = req.connection;
  if (req.query.ServerKenmerk) {
    conn.db.collection("soap").findOne({ ServerKenmerk: req.query.ServerKenmerk }, { '_id': 0 }, function (err, result) {
      if (err) {
          conn.close();
          return res.status(500).send(err);
      }
      res.data = result;
      conn.close();
      next();
    })
  } else {
    conn.db.collection("soap").find({}, { '_id': 0 }).toArray(function (err, result) {
      if (err) {
        conn.close();
          return res.status(500).send(err);
      }
      res.data = result;
      conn.close();
      next();
    })
  }

}

function updateStatus(req, res, next) {
//  console.log("---------- UPLOAD SERVICE REQUEST---------");
//  console.log(JSON.stringify(req.body));
//  logger.info(JSON.stringify(req.body));
  const conn = req.connection;
  if (req.query.ServerKenmerk) {
    conn.db.collection("soap").findOneAndUpdate({ ServerKenmerk: req.query.ServerKenmerk }, { $set: req.body }, { returnOriginal: false }, function (err, result) {
      if (err) {
        console.log(err);
          conn.close();
          return res.status(500).send(err);
      }
      if (result.value == null) {
        res.data = result.value;
        conn.close();
        next();
      } else {
        delete result.value._id;
        res.data = result.value;
        conn.close();
        next();
      }

    })
  } else {
    logger.error('ServerKenmerk is required');
    return res.status(422).send({ error: { statusCode: 422, message: 'ServerKenmerk is required' } });
  }
}

function deleteStatus(req, res, next) {
  const conn = req.connection;
  if (req.query.ServerKenmerk) {
    conn.db.collection("soap").remove({ ServerKenmerk: req.query.ServerKenmerk }, function (err, result) {
      if (err) {
          conn.close();
          return res.status(500).send(err);
      }
      if (result.result.n == 0) {
        logger.error('No record found to delete');
        conn.close();
        return res.status(422).send({ error: { statusCode: 422, message: 'No record found to delete' } });
      }
      res.data = { statusCode: 200, message: 'Record successfully deleted' };
      logger.info(res.data);
      conn.close();
      next();
    })

  } else {
    logger.error('ServerKenmerk is required');
    return res.status(422).send({ error: { statusCode: 422, message: 'ServerKenmerk is required' } });
  }
}
