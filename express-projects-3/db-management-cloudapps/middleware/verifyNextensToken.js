var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = function(req,res,next) {
  var bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    var bearer = bearerHeader.split(" ");
    var bearerToken = bearer[1];
    // verifies secret and checks exp
        jwt.verify(bearerToken, config.nextensSecret, function(err, decoded) {
            if (err) { //failed verification.
            return res.status(401).send({error:{ statusCode:401,message:'Invalid token'}});
            }

            decoded.nextensUser.id;
          //  console.log(decoded.nextensUser);
            var conn = req.connection;
            conn.on('error',function(){
              console.log('errorroror');
              return res.status(500).send({error: {statusCode: 500, message: "Connection failed"}});
            })
           conn.once('open', function() {
             conn.db.collection("oauth").findOne({id:decoded.nextensUser.id}, function(mongoErr, result) {
              // console.log(result);
               if (!result) {
                 return res.status(401).send({error:{ statusCode:401,message:'Invalid token----'}});
                    // return res.status(401).send('This token is not for this db');
               }
                return next();
             })
           })
         })


  }else {
    return res.status(401).send({error:{ statusCode:401,message:'Authorization Required'}});
   }
}
