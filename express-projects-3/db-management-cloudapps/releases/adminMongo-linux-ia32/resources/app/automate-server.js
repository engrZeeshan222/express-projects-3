var Service = require('node-windows').Service;
var cmd = require('node-cmd');
var later = require('later');
const request = require('request');

//  Mail config.
var mandrillTransport = require('nodemailer-mandrill-transport');
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: '_sTuqnrpNCg4bGce9vlzoQ'
  }
}));


var log4js = require('log4js');
log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'automated-logs.log' }
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' }
  }
});
var logger_2 = log4js.getLogger();
logger_2.level = 'debug';

later.date.localTime();

// Flags 
var status = 'idle';
var dnd = false;


// schedule for auto restart node server
var textSched1 = later.parse.recur().on('03:15:00').time();
var timer1 = later.setInterval(medium1, textSched1);

// schedule for check node service
var textSched2 = later.parse.text('every 30 seconds');
var timer2 = later.setInterval(medium2, textSched2);

//schedule for auto start MongoDB
var textSched3 = later.parse.recur().on('03:02:00').time().on(1, 3, 5, 7).dayOfWeek();
var timer3 = later.setInterval(autoRestartMongoDB, textSched3);

//schedule for test API
var textSched4 = later.parse.text('every 10 minutes');
var timer4 = later.setInterval(checkResponse, textSched4);

// To Prevent processes to interfare 

var textSched5 = later.parse.recur().on('03:00:00').time();
var timer5 = later.setInterval(preventInterfare1, textSched5);

var textSched6 = later.parse.recur().on('03:17:00').time();
var timer6 = later.setInterval(preventInterfare2, textSched6);

// End Prevent processes to interfare schedules

function preventInterfare1() {
  dnd = true;
}

function preventInterfare2() {
  dnd = false;
}

function checkMongoStatus(cb) {
  cmd.get(
    `sc query "MongoDB" | find "RUNNING"`,
    function (err, data, stderr) {
      var data1 = JSON.stringify(data).replace(/ /g, "").slice(1, -5);
      if (data1.includes("STATE:4RUNNING")) {
        cb('running')
      } else {
        cb('stopped')
      }
    });
}

function checkNodeServiceStatus(cb) {
  cmd.get(
    `sc query "nodeservice2.exe" | find "RUNNING"`,
    function (err, data, stderr) {
      var data1 = JSON.stringify(data).replace(/ /g, "").slice(1, -5);
      if (data1.includes("STATE:4RUNNING")) {
        cb('running')
      } else {
        cb('stopped')
      }
    });
}

function startNodeServer(cb) {
  cmd.get(
    `net start "nodeservice2.exe"`,
    function (err, data, stderr) {
      console.log(data);
      logger_2.info(data);
      console.log('cloudapps Started.');
      if (err) {
        console.log("Line number 60");
        console.log(err);
        logger_2.error(err);
      }
      cb();
    }
  );
}

function stopNodeServer(cb) {
  cmd.get(
    `net stop "nodeservice2.exe"`,
    function (err, data, stderr) {
      console.log('cloudapps stopped.');
      logger_2.info('cloudapps stopped.');
      if (err) {
        console.log("Line number 74");
        console.log(err);
      }
      cb();
    }
  );
}

function startMongoDB(cb) {
  console.log("Start MongoDB function called");
  cmd.get(
    `net start MongoDB`,
    function (err, data, stderr) {
      console.log('MongoDB started');
      logger_2.info('MongoDB started.');
      setTimeout(function () { cb(); }, 30000);
      if (err) {
        console.log("Line number 90");
        console.log(err);
      }
    }
  );
}

function stopMongoDB(cb) {
  console.log("Stop MongoDB function called");
  logger_2.info("Stop MongoDB function called");
  cmd.get(
    `net stop MongoDB`,
    function (err, data, stderr) {
      console.log('MongoDB Stopped');
      logger_2.info("MongoDB Stopped");
      setTimeout(function () { cb(); }, 30000);
      if (err) {
        console.log("Line number 105");
        console.log(err);
      }
    }
  );
}

function checkForNodeService(cb) {
  cmd.get(
    `sc query "nodeservice2.exe"`,
    function (err, data, stderr) {
      var data1 = JSON.stringify(data).replace(/ /g, "").slice(1, -5);
      if (data1.includes("Thespecifiedservicedoesnotexistasaninstalledservice")) {
        status = 'critical';
        console.log("Service Not Found. Creating The Service.... Please wait.");
        // Create a new service object
        var svc = new Service({
          name: 'nodeservice2',
          description: 'The nodejs service.',
          script: 'app.js'
        });
        // Listen for the "install" event, which indicates the
        // process is available as a service.
        svc.on('install', function () {
          svc.start();
        });
        svc.install();
        setTimeout(function () {
          console.log('\x1b[33m%s\x1b[0m', 'Service has created. To confirm try out this command - sc query "nodeservice2.exe"  in Administarator Command Prompt.');
          status = 'idle';
          process.exit();
        }, 60000);
      } else {
        cb(true);
      }
    });
}

function checkServerStatus(flag) {
  var d = new Date();
  // console.log('checkServerStatus function called by ' + flag + ' at ' + d);

  //logger_2.info('checkServerStatus function called by ' + flag + ' at ' + d);

  if ((status == 'idle' && flag == 'interval') && dnd == false) {
    // console.log("Checking Server...");

    //logger_2.info("Checking Server...");

    checkNodeServiceStatus((data) => {
      if (data == 'running') {
        //if server is alredy running, then we have to stop this and start again.. 
        // console.log("Server is running alredy, Nothing to do.");
        //    logger_2.info("Server is running alredy, Nothing to do.");
      } else {
        //we can start server directly
        sendEmail("Line number : 207, Mail Triggered by the Interval function.");
        console.log("\x1b[31m%s\x1b[0m", "Server has stoped, Starting again.");
        logger_2.info("Server has stoped, Starting again.");
        startNodeServer(() => {
          console.log("\x1b[32m%s\x1b[0m", "Success!");
        });
      }
    });
  } else if (flag == 'fromLater' || flag == 'checkResponse') {
    console.log('----------------------------------------------');
    console.log('Restarting Node Service.');
    console.log('----------------------------------------------');

    logger_2.info('----------------------------------------------');
    logger_2.info('Restarting Node Service.');
    logger_2.info('----------------------------------------------');

    status = 'busy';
    checkForNodeService((res) => {
      if (res) {
        // console.log('Service has already created..')
        checkMongoStatus((data) => {
          if (data == 'running') {
            // console.log("MongoDB is runnnng, Now we can restart the server.");
            logger_2.info("MongoDB is runnnng, Now we can restart the server.");

            checkNodeServiceStatus((data) => {
              if (data == 'running') {
                //if server is alredy running, then we have to stop this and start again.. 
                // console.log("Server is running alredy, Stoping this......");

                logger_2.info("Server is running alredy, Stoping this......");


                stopNodeServer(() => {
                  startNodeServer(() => {
                    console.log("\x1b[32m%s\x1b[0m", "Successfully restarted the Node Service.");
                    status = 'idle';
                  });
                });
              } else {
                //we can start server directly
                sendEmail("Line number : 249, Mail Triggered by the FromLater function (which initiates everyday on 03:00 AM) function.");
                console.log("\x1b[31m%s\x1b[0m", "Server is stoped alredy, Starting again......");

                logger_2.info("Server is stoped alredy, Starting again......");

                startNodeServer(() => {
                  console.log("Done");
                  status = 'idle';
                });
              }
            });
          } else {
            // MongoDB is not running. 
            sendEmail("MongoDB is not running, attempting to start");

            console.log("MongoDB is not running, attempting to start.... ");

            startMongoDB(() => {
              console.log("Again checking the server stauts. Wait for 1 Min......");
              setTimeout(function () { checkServerStatus(flag); }, 60000);
            });
          }
        });
      }
    });
  }
}

function medium1() {
  if (status != 'critical') {
    checkServerStatus('fromLater');
  } else {
    ///  console.log("Critical Proceses are under execution, Exiting...");
  }
}

function medium2() {
  if (status == 'idle' && dnd == false) {
    checkServerStatus('interval');
  } else {
    //  console.log("Process is under execution, Exiting...");
  }
}

function autoRestartMongoDB() {
  status = 'critical';
  var d = new Date();
  console.log('----------------------------------------------');
  console.log('autoRestartMongoDB function called at ' + d);
  console.log('----------------------------------------------');

  logger_2.info('----------------------------------------------');
  logger_2.info('autoRestartMongoDB function called at ' + d);
  logger_2.info('----------------------------------------------');

  checkMongoStatus((res) => {
    if (res == 'running') {
      stopMongoDB((data) => {
        startMongoDB((data1) => {
          console.log("MongoDB strated.");
          status = 'idle';
        });
      });
    } else {
      startMongoDB((data1) => {
        console.log("MongoDB strated.");
        status = 'idle';
      });
    }
  });
}

var testAPI = (cb) => {
  request({
    url: 'https://backend.cloudapps.services:7561/test/server',
    json: true
  }, (error, response, body) => {
    cb(body);
  })
}

var res_count = 0;
function checkResponse() {
  if ((status != 'critical' || status != 'busy') && dnd == false) {
    var t0 = new Date();
    testAPI((res) => {
      // console.log(res);
      logger_2.info(res);
      var t1 = new Date();
      var time_difference = t1 - t0;
      if (time_difference > 2000) {
        status = 'response_err';
        res_count++;
        console.log('---------------------------------------------------------------------------------------------------------------------');
        console.log("\x1b[31m%s\x1b[0m", "The Response took " + (time_difference) + " milliseconds. Max time out limit excceds, restarting the node service... ");
        console.log('---------------------------------------------------------------------------------------------------------------------');

        logger_2.info('---------------------------------------------------------------------------------------------------------------------');
        logger_2.info("The Response took " + (time_difference) + " milliseconds. Max time out limit excceds, restarting the node service... ");
        logger_2.info('---------------------------------------------------------------------------------------------------------------------');

        if (res_count > 3) {
          sendEmail("The Response took " + (time_difference) + " milliseconds. Max time out limit excceds, restarting the node service... ")
        }

        checkServerStatus('checkResponse');
      } else {
        status = 'idle';
        res_count = 0;
      }
    });
  } else {
    console.log("Critical Proceses are under execution, Exiting...");

    logger_2.info("Critical Proceses are under execution, Exiting...");
  }
}


checkForNodeService((res) => {
  console.log("\x1b[32m%s\x1b[0m", "Script has started. Make sure you are using an Adminsitrative Command Prompt.");
});


// Send Mail.

function sendEmail(message) {

  // if (dnd == false) {

  //   var mailOptions = {};
  //   mailOptions = {
  //     from: 'Backend CloudApss Services<info@cloudapps.services>',
  //     to: ['sourabh.agrawal@zehntech.com', 'resul@brixxs.com', 'piyush.rathod@zehntech.com'],
  //     subject: '[Urgent] Backend Went Down!',
  //     html: "<h4>Backend Went Down on " + new Date() + " :  <small> Tried to restart it again by the Monitoring script. Still make sure whether is working properly. </small> </h4><br><p> Captured log : <p> " + message + " </p></p>"
  //   }

  //   transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       return console.log(error);
  //     }
  //     // Preview only available when sending through an Ethereal account
  //     // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  //   });

  // }

}
