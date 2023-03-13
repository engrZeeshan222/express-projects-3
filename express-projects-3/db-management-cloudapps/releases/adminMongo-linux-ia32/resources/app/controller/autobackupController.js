var fs = require('fs');
var mongodbBackup = require('mongodb-backup');
var path = require('path');
var later = require('later');
var _ = require('lodash');
var exec = require('child_process').exec;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
  autoBackupAllDB
};

var textSched = later.parse.text('every 4 hour');
var timer2 = later.setInterval(autoBackupAllDB, textSched);

async function autoBackupAllDB(req,res,next){
  var async = require('async');
  const conn = await mongoose.createConnection().openUri('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/cloud-backend-service?authSource=admin');
  var weekday = new Array(7);
      weekday[0] =  "Sun";
      weekday[1] = "Mon";
      weekday[2] = "Tues";
      weekday[3] = "Wed";
      weekday[4] = "Thurs";
      weekday[5] = "Fri";
      weekday[6] = "Sat";

      var months = new Array(11);
          months[0] =  "Jan";
          months[1] = "Feb";
          months[2] = "Mar";
          months[3] = "Apr";
          months[4] = "May";
          months[5] = "Jun";
          months[6] = "Jul";
          months[7] = "Aug";
          months[8] = "Sep";
          months[9] = "Oct";
          months[10] = "Nov";
          months[11] = "Dec";

  var date = new Date();
  var day = weekday[date.getDay()];
  var year = date.getFullYear();
  var dateNum = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var month = months[date.getMonth()];
  var adminDb = conn.db.admin();
  var username = 'superAdmin1';
  var password = 'Qwerty12345!';

  adminDb.listDatabases(function (err, db_list){
      async.forEachOf(db_list.databases, function (value, key, callback){
        var final_location = value.name+'_'+day+'_'+month+'_'+dateNum+'_'+year+'_'+hour+'_'+minute+'_'+'00';
        var newBackupPath = '../autobackup/backups/'+final_location;
        var cmd = 'mongodump --host 127.0.0.1 --port ' + 61725 + ' --db ' + value.name + ' --username ' + username + ' --password ' + password + ' --authenticationDatabase admin --out ' + newBackupPath; // Command for mongodb dump process
        exec(cmd, function (error, stdout, stderr) {
          if(error){
            logger.error(error);
            console.log(error);
          }
        })
        // kick off the backup
        // mongodbBackup({uri: uri, root: path.join(__dirname, '../autobackup/'+value.name+'_'+new Date()), callback: function(err){
        //     if(err){
        //         console.error('Backup DB error: ' + err);
        //         //res.status(400).json({'msg': 'Unable to backup database'});
        //     }
        // }})
      })
      logger.info('Database successfully backed up');
      console.log('Database successfully backed up');
      //res.status(200).json({'msg': 'Database successfully backed up'});
   })

 }
