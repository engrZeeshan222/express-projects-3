var config = require('../config/database');

module.exports = function(req,res,next) {
  var bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    var bearer = bearerHeader.split(" ");
    var bearerToken = bearer[1];

    if(config.adminSecret === bearerToken){
      next();
    }
  }else {
    return res.status(401).send({error:{ statusCode:401,message:'Authorization Required'}});
   }
};
