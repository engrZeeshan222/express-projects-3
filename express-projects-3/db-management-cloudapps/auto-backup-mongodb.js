var log4js = require('log4js');
var fs = require('fs');
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'logs.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});
var logger_2 = log4js.getLogger();
logger_2.level = 'debug';
var later = require('later');
later.date.localTime();

var textSched = later.parse.text('every 24 hours');
later.setInterval(autoBackupAllDB, textSched);
function autoBackupAllDB() {
    console.log("Start auto backup on "+ new Date());
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var months = new Array(11);
    months[0] = "Jan";
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
    var dir_name = '../autobackup/backups/dir_' + day + '_' + month + '_' + dateNum + '_' + year + '_' + hour + '_' + minute + '_' + '00';
    
    fs.mkdir(dir_name, function(err){
        console.log(err)
        var cmd = require('node-cmd');
        cmd.get(
            'mongodump --host 127.0.0.1 --port 61725 --username superAdmin1 --password Qwerty12345! --out ' + dir_name,
            function (err, data, stderr) {
                if (err) {
                    console.log("Error in auto backup", err);
                    // logger_2.info("Service is already running.");
                } else {
                    console.log("Auto backup completed successfully");
                    console.log(data);
                    console.log(stderr);
                }

            }
        );
    });
}
