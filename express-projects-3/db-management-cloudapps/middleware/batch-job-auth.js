var config = require('../config/database');
const User = require('../models/user');

module.exports = function(req,res,next) {
  if(req.body && (req.body.Username || req.body.username) && (req.body.Password || req.body.password)){
    if((req.body.Username == 'resul@brixxs.com' || req.body.username == 'resul@brixxs.com') && (req.body.Password == 'Qwerty@123!' || req.body.password == 'Qwerty@123!')){
      return next();
    }else{
      return res.status(401).send({error:{ statusCode:401,message:'Invalid Credentials'}});
    }
  }else{
    return res.status(401).send({error:{ statusCode:401,message:'Authorization Required'}});
  }
}
