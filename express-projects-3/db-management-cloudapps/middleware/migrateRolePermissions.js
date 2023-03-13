const Role = require('../models/roles');
const RolePermission = require('../models/role_permissions');


module.exports =  function(req,res,next){
  var conn = req.connection;
    // check for the role_permissions if not exist then createSchema and with required defaults fields
    let role_permissions1 = conn.model('role_permissions',RolePermission.role_permissionSchema);
    role_permissions1.findOne({}).then(permissions=>{
      if(!permissions){
        migrateRolePermissions(conn);
      }
    }).catch(err=>{
        return res.status(500).send({error:{ statusCode:500,message:err}});
      //return res.status(500).send({error:"Role-Permission schema not created, Something went wrong , please try again later",status_code:500});
    });


function migrateRolePermissions(conn){
  let Role1 = conn.model('roles',Role.roleSchema);
  // Registered user permissions
  Role1.findOne({name:'Registered'},function(error,sRole){
    let role_id = sRole.Id;
    const registeredUserTablesAndPermissions = {
      role:role_id,
      permission:{
      "app_user":{"read":true,"create":true,"update":true,"delete":true},
      "appointments":{"read":true,"create":true,"update":true,"delete":true},
      "AppSettings":{"read":true,"create":true,"update":true,"delete":true},
      "berichtenarchief":{"read":true,"create":true,"update":true,"delete":true},
      "brochures":{"read":true,"create":true,"update":true,"delete":true},
      "client_portal_data":{"read":true,"create":true,"update":true,"delete":true},
      "employee":{"read":true,"create":true,"update":true,"delete":true},
      "enquete":{"read":true,"create":true,"update":true,"delete":true},
      "favourites":{"read":true,"create":true,"update":true,"delete":true},
      "kantoor":{"read":true,"create":true,"update":true,"delete":true},
      "logins":{"read":true,"create":true,"update":true,"delete":true},
      "meersortering":{"read":true,"create":true,"update":true,"delete":true},
      "overons_sortering":{"read":true,"create":true,"update":true,"delete":true},
      "Pagina":{"read":true,"create":true,"update":true,"delete":true},
      "photogallery":{"read":true,"create":true,"update":true,"delete":true},
      "questions":{"read":true,"create":true,"update":true,"delete":true},
      "quotations":{"read":true,"create":true,"update":true,"delete":true},
      "recommendations":{"read":true,"create":true,"update":true,"delete":true},
      "role_permissions":{"read":true,"create":true,"update":true,"delete":true},
      "roles":{"read":true,"create":true,"update":true,"delete":true},
      "sector":{"read":true,"create":true,"update":true,"delete":true},
      "select_options":{"read":true,"create":true,"update":true,"delete":true},
      "Settings":{"read":true,"create":true,"update":true,"delete":true},
      "social_media":{"read":true,"create":true,"update":true,"delete":true},
      "targetgroup":{"read":true,"create":true,"update":true,"delete":true},
      "topics":{"read":true,"create":true,"update":true,"delete":true},
      "totalemployees":{"read":true,"create":true,"update":true,"delete":true},
      "users":{"read":true,"create":true,"update":true,"delete":true},
      "videos":{"read":true,"create":true,"update":true,"delete":true},
      "webpage":{"read":true,"create":true,"update":true,"delete":true},
      "woning":{"read":true,"create":true,"update":true,"delete":true}
    }
  };

      var role_permissions2 = conn.model('role_permissions',RolePermission.role_permissionSchema);
      var role_permissions2 = new role_permissions2(registeredUserTablesAndPermissions);
      role_permissions2.save().then(sPermission=>{
        if(!sPermission){
          return res.status(500).send({error:{ statusCode:500,message:"Roles-Permissions collection not migrated, something went wrong please try again later"}});
        }
        }).catch(err=>{
            return res.status(500).send({error:{ statusCode:500,message:err}});
        })
  })

  // app_user permissions
  Role1.findOne({name:'app_user'},function(error,sRole){
    let role_id = sRole.Id;
    const appUserTablesAndPermissions = {
      role:role_id,
      permission:{
      "app_user":{"read":false,"create":true,"update":false,"delete":false},
      "appointments":{"read":false,"create":true,"update":false,"delete":false},
      "AppSettings":{"read":true,"create":false,"update":false,"delete":false},
      "berichtenarchief":{"read":true,"create":false,"update":false,"delete":false},
      "brochures":{"read":true,"create":false,"update":false,"delete":false},
      "client_portal_data":{"read":false,"create":true,"update":false,"delete":false},
      "employee":{"read":true,"create":false,"update":false,"delete":false},
      "enquete":{"read":false,"create":true,"update":false,"delete":false},
      "favourites":{"read":false,"create":true,"update":false,"delete":false},
      "kantoor":{"read":true,"create":false,"update":false,"delete":false},
      "logins":{"read":true,"create":false,"update":false,"delete":false},
      "meersortering":{"read":true,"create":false,"update":false,"delete":false},
      "overons_sortering":{"read":true,"create":false,"update":false,"delete":false},
      "Pagina":{"read":true,"create":false,"update":false,"delete":false},
      "photogallery":{"read":true,"create":false,"update":false,"delete":false},
      "questions":{"read":false,"create":true,"update":true,"delete":false},
      "quotations":{"read":false,"create":true,"update":true,"delete":false},
      "recommendations":{"read":true,"create":false,"update":false,"delete":false},
      "role_permissions":{"read":false,"create":false,"update":false,"delete":false},
      "roles":{"read":false,"create":false,"update":false,"delete":false},
      "sector":{"read":true,"create":false,"update":false,"delete":false},
      "select_options":{"read":true,"create":false,"update":false,"delete":false},
      "Settings":{"read":true,"create":false,"update":false,"delete":false},
      "social_media":{"read":true,"create":false,"update":false,"delete":false},
      "targetgroup":{"read":true,"create":false,"update":false,"delete":false},
      "topics":{"read":true,"create":false,"update":false,"delete":false},
      "totalemployees":{"read":true,"create":false,"update":false,"delete":false},
      "users":{"read":true,"create":false,"update":true,"delete":false},
      "videos":{"read":true,"create":false,"update":false,"delete":false},
      "webpage":{"read":true,"create":false,"update":false,"delete":false},
      "woning":{"read":true,"create":true,"update":true,"delete":true}
      }
    };

    var role_permissions2 = conn.model('role_permissions',RolePermission.role_permissionSchema);
    var role_permissions3 = new role_permissions2(appUserTablesAndPermissions);
    role_permissions3.save().then(sPermission=>{
      if(!sPermission){
        return res.status(500).send({error:{ statusCode:500,message:"Roles-Permissions collection not migrated, something went wrong please try again later"}});
      }
      }).catch(err=>{
          return res.status(500).send({error:{ statusCode:500,message:err}});
      })

    })

  }

      if(!res.headersSent){
      //  console.log('headersSent'+res.headersSent);
        next();
        return;
      }
}
