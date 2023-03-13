const bcrypt = require('bcryptjs');
const Role = require('../models/roles');
const User = require('../models/user');



module.exports =  function(req,res,next){

  if(req.query.createdNewDB == 'true'){
  var conn = req.connection;
  //console.log("param new db: "+req.query.createdNewDB);
  // first check for roles if not exist than createSchema and with required defaults fields
  var Role1 = conn.model('role',Role.schema);
    Role1.findOne({}).then(srole=>{
        if(!srole){
          Role1.create({Name: 'Res'},{Name: 'app_user'},{Name: 'Registered'},{Name: 'healthcareEmployee'},function(err,sRoles){
            if(!sRoles){
              return res.status(500).send({error:{ statusCode:500,message:'Roles not created'}});
            }
            //console.log("sRolessss: "+sRoles.name);
            if(sRoles.Name == 'Res'){
              var role_id = sRoles.Id;
              var serviceuser1 = conn.model('user',User.schema);
              serviceuser1.findOne({Username:'mainuser'}).then(serviceuserR=>{
                  if(!serviceuserR){
                      //console.log("not serviceUserData");
                      bcrypt.genSalt(10,function(errr,salt){
                        bcrypt.hash("mainuser",salt,function(err,hash){
                          if(err) return next('Password hashing failure');
                          var passwordNew = hash;
                           console.log("password: "+passwordNew);
                            var newUser = new serviceuser1({Username:'mainuser',
                            Role:role_id,
                            IdentityProvider: req.query.isAutoMigrate === 'false' ? 'HealthCare' : 'EverLive',
                            Password:passwordNew
                          });
                            newUser.save(function(error,createdUser){
                              if(error){
                                   return res.status(500).send({error:{ statusCode:500,message:error}});
                                   // return res.status(500).send({ error:"Default Service user schema not created, Something went wrong,Please try again later",status_code:500 });
                              }else {
                                  return next();
                              }
                            })
                        })
                     })
                  }
                  //console.log(" serviceUserData");
                }).catch(err=>{
                    return res.status(500).send({error:{ statusCode:500,message:err}});
                  // return res.status(500).send({ error: "Roles schema not created, Something went wrong,Please try again later",status_code:500 });
                })
            }
          })
        }else {
            return next();
        }
    }).catch(err=>{
        return res.status(500).send({error:{ statusCode:500,message:err}});
      // return res.status(500).send({ error: "Roles schema not created, Something went wrong,Please try again later",status_code:500 });
    })
  }else{
    return next();
  }
}
