var jwt = require('jsonwebtoken');
var config = require('../config/database');
const User = require('../models/user');

module.exports = function(req,res,next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    // verifies secret and checks exp
        jwt.verify(bearerToken, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).send({error:{ statusCode:401,message:'Invalid token'}});
            }
            req.userRole = decoded.user.Role;
            req.methodType = req.method;
            //console.log("method: "+req.methodType);
            req.token = bearerToken;
            req.user_id = decoded.user.Id;
            if(decoded.user && decoded.user.PlayerId){
              req.player_id = decoded.user.PlayerId
            }
            var conn = req.connection;
            var User1 = conn.model('user',User.schema);
             User1.findOne({Id:decoded.user.Id})
             .then((user) => {
                 if (!user) {
                   return res.status(401).send({error:{ statusCode:401,message:'Invalid token'}});
                 }
                  return next();
             });
        });
  }else {
    return res.status(401).send({error:{ statusCode:401,message:'Authorization Required'}});
   }
}
