var mongoose = require('mongoose');

module.exports = {
 verifyPin
};

async function verifyPin(req, res, next)  {
    const dbpin = req.params.db;
    const conn = await mongoose.createConnection().openUri('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/cloud-backend-service?authSource=admin');
    var adminDb = conn.db.admin();
    adminDb.listDatabases(function (err, db_list){
        var t = db_list.databases.map((f)=> f.name == dbpin);
         return res.status(200).send({ success: t.includes(true) });
     });
  }