var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var nconf = require('nconf');
var session = require('express-session');
var async = require('async');
var moment = require('moment');
var fs = require('fs');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var setConnection = require('./middleware/set-connection');
const pdfConfig = require('./models/pdfConfig');
const pdfParser = require('pdf-parse');


// Define routes
var indexRoute = require('./routes/index');
var apiRoute = require('./routes/api');
var usersRoute = require('./routes/users');
var configRoute = require('./routes/config');
var docRoute = require('./routes/document');
var dbRoute = require('./routes/database');
var collectionRoute = require('./routes/collection');

var app = express();

var routes = require('./routes/routes');
// soap
var soap = require('soap');
var rp = require('request-promise');

var log4js = require('log4js');
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

/// logs for Nextens 
var log4jsNextens = require('log4js');
log4jsNextens.configure({
  appenders: {
    everything: { type: 'file', filename: 'nextens.log' }
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' }
  }
});

var logger_nextens = log4jsNextens.getLogger();
logger_nextens.level = 'debug';


app.use(cors());

app.use('/v1/:db/:collection', setConnection);
app.use('/v0/:db/:collection', setConnection);
app.use('/v3/:db/:collection', setConnection);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
routes(app);

// set the base dir to __dirname when running as webapp and electron path if running as electron app
var dir_base = __dirname;

// setup the translation
var i18n = new (require('i18n-2'))({
  locales: ['en', 'de', 'es', 'ru'],
  directory: path.join(dir_base, 'locales/')
});
// setup DB for server stats
var Datastore = require('nedb');
var db = new Datastore({ filename: path.join(dir_base, 'data/dbStats.db'), autoload: true });
// view engine setup
app.set('views', path.join(dir_base, 'views/'));
app.engine('hbs', handlebars({ extname: 'hbs', defaultLayout: path.join(dir_base, 'views/layouts/layout.hbs') }));
app.set('view engine', 'hbs');

// helpers for the handlebars templating platform
handlebars = handlebars.create({
  helpers: {
    __: function (value) {
      return i18n.__(value);
    },
    toJSON: function (object) {
      return JSON.stringify(object);
    },
    niceBool: function (object) {
      if (object === undefined) return 'No';
      if (object === true) return 'Yes';
      return 'No';
    },
    app_context: function () {
      if (nconf.stores.app.get('app:context') !== undefined) {
        return '/' + nconf.stores.app.get('app:context');
      } return '';
    },
    ifOr: function (v1, v2, options) {
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    },
    ifNotOr: function (v1, v2, options) {
      return (v1 || v2) ? options.inverse(this) : options.fn(this);
    },
    formatBytes: function (bytes) {
      if (bytes === 0) return '0 Byte';
      var k = 1000;
      var decimals = 2;
      var dm = decimals + 1 || 3;
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
    },
    formatDuration: function (time) {
      return moment.duration(time, 'seconds').humanize();
    }
  }
});


// setup nconf to read in the file
// create config dir and blank files if they dont exist
var dir_config = path.join(dir_base, 'config/');
var config_connections = path.join(dir_config, 'config.json');
var config_app = path.join(dir_config, 'app.json');

// Check existence of config dir and config files, create if nothing
if (!fs.existsSync(dir_config)) fs.mkdirSync(dir_config);

// The base of the /config/app.json file, will check against environment values
var configApp = {
  app: {}
};
if (process.env.HOST) configApp.app.host = process.env.HOST;
if (process.env.PORT) configApp.app.port = process.env.PORT;
if (process.env.PASSWORD) configApp.app.password = process.env.PASSWORD;
if (process.env.LOCALE) configApp.app.locale = process.env.LOCALE;
if (process.env.CONTEXT) configApp.app.context = process.env.CONTEXT;
if (process.env.MONITORING) configApp.app.monitoring = process.env.MONITORING;

if (!fs.existsSync(config_app)) fs.writeFileSync(config_app, JSON.stringify(configApp));

// Check the env for a connection to initiate
var configConnection = {
  connections: {}
};
if (process.env.CONN_NAME && process.env.DB_HOST) {
  if (!process.env.DB_PORT) process.env.DB_PORT = '27017'; // Use the default mongodb port when DB_PORT is not set
  var connectionString = 'mongodb://';
  if (process.env.DB_USERNAME && process.env.DB_PASSWORD && process.env.DB_NAME) {
    connectionString += process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;
  } else if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
    connectionString += process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/'
  } else {
    connectionString += process.env.DB_HOST + ':' + process.env.DB_PORT
  }
  configConnection.connections[process.env.CONN_NAME] = {
    connection_options: {},
    connection_string: connectionString
  };
}
if (!fs.existsSync(config_connections) || fs.readFileSync(config_connections, 'utf8') === '{}')
  fs.writeFileSync(config_connections, JSON.stringify(configConnection));

// if config files exist but are blank we write blank files for nconf
if (fs.existsSync(config_app, 'utf8')) {
  if (fs.readFileSync(config_app, 'utf8') === '') {
    fs.writeFileSync(config_app, '{}', 'utf8');
  }
}
if (fs.existsSync(config_connections, 'utf8')) {
  if (fs.readFileSync(config_connections, 'utf8') === '') {
    fs.writeFileSync(config_connections, '{}', 'utf8');
  }
}

// setup the two conf. 'app' holds application config, and connections
// holds the mongoDB connections
nconf.add('connections', { type: 'file', file: config_connections });
nconf.add('app', { type: 'file', file: config_app });

// set app defaults
var app_host = process.env.HOST || '0.0.0.0';
var app_port = process.env.PORT || 7561;

// get the app configs and override if present
if (nconf.stores.app.get('app:host') !== undefined) {
  app_host = nconf.stores.app.get('app:host');
}
if (nconf.stores.app.get('app:port') !== undefined) {
  app_port = nconf.stores.app.get('app:port');
}
if (nconf.stores.app.get('app:locale') !== undefined) {
  i18n.setLocale(nconf.stores.app.get('app:locale'));
}

app.locals.app_host = app_host;
app.locals.app_port = app_port;

// setup the app context
var app_context = '';
if (nconf.stores.app.get('app:context') !== undefined) {
  app_context = '/' + nconf.stores.app.get('app:context');
}

// soap setup
/**
-this is remote service defined in this file, that can be accessed by clients, who will supply args
-response is returned to the calling client
-our service UploadService  by calling UploadDocuments, GetStatus, GetStatusExt methods through port:UploadServiceSoap
**/

var service = {
  UploadService: {
    UploadServiceSoap: {
      UploadDocuments:  function (args, callback, headers, req) {
        logger_2.info(args);
        // variables:
        var sessionId;
   
        var parameters;
        var fieldName;
        var fileName = 'file';
        var extension = 'pdf';
        var createdRecordId;
        var serverRequestedDate;
        var binaryData;
        var binaryArray = [];
        var toggle = false;
        var P_toggle = false;
        var now = new Date();
        var month;

        serverRequestedDate = JSON.parse(JSON.stringify(now));


        //UplaodData parameters:
        var U_Username;
        var U_Password;
        var U_Base64XML;
        var U_Base64ALB;
        var U_Base64Prints;
        var U_EigenKenmerk;
        var U_PI_Kenmerk;
        var U_ServiceRequested;
        var U_ConversionRequested;
        var U_DocumentSoort;
        var U_DocumentPeriode;
        var U_XMLSoort;
        var U_PrintSoort;
        var U_AangifteJaar;

        // PartnerData parameters:
        var P_BSNPartner;
        var P_TXMLSoort;
        var P_PrintSoort;
        var P_Base64XML;
        var P_Base64ALB;
        var P_Base64Prints;

        // get credentials from request headers
    
        const basicHeader = req.headers['authorization'];
        if (typeof basicHeader !== 'undefined') {
          const basic = basicHeader.split(" ");
          const basicToken = basic[1];
          var b64string = basicToken; /* whatever */;
          var buf = new Buffer(b64string, 'base64').toString("ascii");; // Ta-da
        
          var fields = buf.split(':');
          U_Username = fields[0];
          U_Password = fields[1];

        }

        //if UploadData is present:
        if ('UploadData' in args) {
       
          if (args.UploadData != null) {
            U_Base64XML = args.UploadData.Base64XML;
            U_Base64ALB = args.UploadData.Base64ALB;
            U_Base64Prints = args.UploadData.Base64Prints;
            U_EigenKenmerk = args.UploadData.EigenKenmerk;
            U_PI_Kenmerk = args.UploadData.PI_Kenmerk;
            U_ServiceRequested = args.UploadData.ServiceRequested;
            U_ConversionRequested = args.UploadData.ConversionRequested;
            U_DocumentSoort = args.UploadData.DocumentSoort;
            U_DocumentPeriode = args.UploadData.DocumentPeriode;
            U_XMLSoort = args.UploadData.XMLSoort;
            U_PrintSoort = args.UploadData.PrintSoort;
            U_AangifteJaar = args.UploadData.AangifteJaar;
          }

          // push U_Base64Prints into U_array also with fieldName
          if (U_Base64XML != undefined) {
            var uObj = { fieldName: 'Nextens_Base64XML', binaryData: U_Base64XML, extension: 'xml' };
            binaryArray.push(uObj);
          }
          if (U_Base64Prints && U_Base64Prints != undefined) {
            var uObj = { fieldName: 'file', binaryData: U_Base64Prints, extension: 'pdf' };
            binaryArray.push(uObj);
          }

          // if PartnerData is present:
          if ('PartnerData' in args.UploadData) {
         
            if (args.UploadData.PartnerData != null) {
              P_BSNPartner = args.UploadData.PartnerData.BSNPartner;
              P_TXMLSoort = args.UploadData.PartnerData.TXMLSoort;
              P_PrintSoort = args.UploadData.PartnerData.PrintSoort;
              P_Base64XML = args.UploadData.PartnerData.Base64XML;
              P_Base64ALB = args.UploadData.PartnerData.Base64ALB;
              P_Base64Prints = args.UploadData.PartnerData.Base64Prints;
            }

            // push P_Base64Prints into P_array also with fieldName
            if (P_Base64XML != undefined) {
              var pObj = { fieldName: 'Nextens_Base64XML_Partner', binaryData: P_Base64XML, extension: 'xml' };
              binaryArray.push(pObj);
            }
            if (P_Base64Prints != undefined) {
              var pObj = { fieldName: 'Nextens_Partner', binaryData: P_Base64Prints, extension: 'pdf' };
              binaryArray.push(pObj);
            }
          }

        }


        //  console.log(U_Base64Prints.string);
        var Klaar;
        if (U_ServiceRequested == 'srVerzenden') {
          Klaar = 1;
        } else {
          Klaar = 0;
        }

        // set parameters logic
        parameters = 'objName=document1&useIds=false&Nextens=true';

        if (U_PI_Kenmerk != undefined) {
          parameters = parameters + '&Nextens_kenmerk=' + U_PI_Kenmerk;
          fileName = U_PI_Kenmerk;
        }
        if (U_DocumentSoort != undefined) {
          parameters = parameters + '&Nextens_documentsoort=' + U_DocumentSoort;
          fileName = fileName + '-' + U_DocumentSoort.substring(2);
        }
        if (U_DocumentPeriode != undefined) {
          parameters = parameters + '&Nextens_documentperiode=' + U_DocumentPeriode;
          fileName = fileName + '-' + U_DocumentPeriode.substring(2);
        }
        if (U_AangifteJaar != undefined) {
          parameters = parameters + '&Nextens_aangiftejaar=' + U_AangifteJaar;
          fileName = fileName + '-' + U_AangifteJaar;
        }
        if (P_BSNPartner != undefined) {
          parameters = parameters + '&Nextens_BSNPartner=' + P_BSNPartner;
        }
       

        // credentials required:
        if (U_Username != undefined && U_Password != undefined) {
         
          var loginStatus = loginFun(U_Username, U_Password);
          loginStatus.then( async (loginRes) => {
          
            sessionId = loginRes.sessionId;
            if (U_DocumentSoort == 'dsBTW' && U_Base64Prints) {
                  await getParametterFromThePDF(U_Base64Prints);
             }
            // call createRecord function
            var recordStatus = createRecordFun(sessionId);
            recordStatus.then(function (recordRes) {
              createdRecordId = recordRes.id;
              if (binaryArray.length != 0) {
                var i = 0;
                binaryArray.forEach(async (item) => {
                
                  fieldName = item.fieldName;
                  extension = item.extension;
                  if ('binaryData' in item) {
                    if (item.binaryData && item.binaryData.string) {
                      binaryData = item.binaryData.string;
                    } else {
                      binaryData = item.binaryData;
                    }
                  }
                  var setBinaryStatus =  setBinaryData(sessionId, createdRecordId, fieldName, binaryData, extension);
                  await setBinaryStatus.then(function (binaryRes) {
                   
                    i++;
                    if (i == binaryArray.length) {
                     
                      toggle = true;
                      if (P_Base64Prints != undefined || P_Base64XML != undefined) {
                        P_toggle = true;
                      }
                      sendResponse(toggle, callback);
                    }
                  })
                    .catch(function (err) {
                      logger_nextens.info("Inside setBinaryStatus");
                      logger_nextens.error(err);
                     
                      var tog = false;
                      if (P_Base64Prints != undefined || P_Base64XML != undefined) {
                        tog = true;
                      }
                      sendErrorResponse(tog, err, callback);
                    })
                })

              } else {
               
                // no parameter available to set binary data
                var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId, FoutMelding: 'No parameters available to set binary data' } };
                callback(responseObj);
              }
            })
              .catch(function (err) {
                logger_nextens.info("Inside recordStatus");
                logger_nextens.error(err);
              
                var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId, FoutMelding: err } };
                callback(responseObj);
              })

          }).catch(function (err) {
            logger_nextens.info("Inside loginStatus");
            logger_nextens.error(err);
            
            var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId, FoutMelding: err } };
            callback(responseObj);
          })

        } else {
        
          var errObj = { status: 'login', Message: 'Username and Password are required' };
        
        
          var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, FoutMelding: errObj } };
          callback(responseObj);
          return;
        }
        

        // loginFun
        function loginFun(U_Username, U_Password) {
          return new Promise(function (resolve, reject) {
            var options = {
              method: 'POST',
              uri: 'https://cloudapps.services/rest/api/login?output=json',
              body: {
                some: 'payload'
              },
              headers: { 'content-type': 'application/json', 'loginName': U_Username, 'password': U_Password },
              json: true // Automatically stringifies the body to JSON
            };
            rp(options)
              .then(function (loginResponse) {
                resolve(loginResponse);
              })
              .catch(function (loginErr) {
                logger_nextens.info("Inside loginFun");
                logger_nextens.error(err);
                reject(loginErr.error.message);
              })
          })
        }

        function createRecordFun(sessionId) {
          return new Promise(function (resolve, reject) {
            var createOptions = {
              method: 'POST',
              uri: 'https://cloudapps.services/rest/api/createRecord?sessionId=' + sessionId + '&' + parameters + '&output=json',
              headers: { 'content-type': 'application/json' },
              json: true // Automatically stringifies the body to JSON
            };
            rp(createOptions)
              .then(function (recordResponse) {
                logger_nextens.info("Inside createRecordFun :: ")
                logger_nextens.info(recordResponse)
                resolve(recordResponse);
              })
              .catch(function (err) {
                logger_nextens.info("Inside createRecordFun");
                logger_nextens.error(err);
                reject(err.error);
              })
          })
        }

        async function getParametterFromThePDF(dataBuffer) {
          try {
            logger_nextens.info("Data Buffer");
            logger_nextens.info(dataBuffer);
            // console.log(dataBuffer)
            let pdfData;
            if( typeof dataBuffer != 'string'){
              pdfData = await pdfParser(Buffer.from(dataBuffer.string[0], 'base64'));
            }else{
              pdfData = await pdfParser(Buffer.from(dataBuffer, 'base64'));
            }
             // Ta-da
            //let pdfData = await pdfParser(Buffer.from(dataBuffer, 'base64'));
            // console.log
            if (pdfData) {
              documentParams = [];
              let linesInArray = pdfData.text.split('\n');

              return await linesInArray.forEach(async function (text, index) {
                // console.log(text);
                await checkPdfLine(linesInArray, text, index);

              });

            } else {

              return null;
            }
          } catch (err) {
            logger_nextens.info("Inside getParametterFromThePDF");
            logger_nextens.error(err);
            // console.log(err);
          }

        }

        function checkPdfLine(textInArray, text, index) {
          // console.log(text);
          let foundItem = pdfConfig.searchTerms.find((item) => text.match(new RegExp(item.term, 'i')));
          if (foundItem) {
            let result = '';
            switch (foundItem.pos) {

              case pdfConfig.positions.inlineafter:
                text = text.trim()
                result = text.slice(foundItem.term.length);

                if (foundItem.type == 'reference') {
                  let parts = result.split(" ");
                  if (parts.length == 4) {
                    console.log(`Found ${foundItem.type}: ${result}`);
                    result.replace(' ', "")
                    foundItem.value = result
                    parameters = parameters + "&" + foundItem.rbField + "=" + result
                    return;
                  }
                }

                if (foundItem.type == 'amount') {
                  result = result.split('€')[1];
                  result = parseFloat(result);
                  console.log(`Found ${foundItem.type}: ${result}`);
                  foundItem.value = result
                  parameters = parameters + "&" + foundItem.rbField + "=" + result
                  return;
                }
                break;

              case pdfConfig.positions.nextline:
                result = textInArray[++index];
                console.log(`Found ${foundItem.type}: ${result}`);

                if (foundItem.type == 'amount')
                  result = result.replace('.', '');
                  foundItem.value = result
                  var dateArray = result.split('-');
               // parameters = parameters + "&" + foundItem.rbField + "=" + result
               result = dateArray[1] + "/" + dateArray[0] + "/"+ dateArray[2]
               parameters = parameters + "&" + foundItem.rbField + "=" + result;
                return;

              case pdfConfig.positions.inlinedateafter:
                result = text.match(new RegExp(foundItem.term + '\\s(\\w+[-\']\\w+[-\']\\w+)'))[1];
                console.log(`Found ${foundItem.type}: ${result}`);
                foundItem.value = result
                var dateArray = result.split('-');
                result = dateArray[0] + "/" + dateArray[1] + "/"+ dateArray[2]
                parameters = parameters + "&" + foundItem.rbField + "=" + result;
                return;

              case pdfConfig.positions.inlinewordafter:
                result = text.match(new RegExp(foundItem.term + '\\s(\\w+)'))[1];
                console.log(`Found ${foundItem.type}: ${result}`);
                foundItem.value = result
                var dateArray = result.split('-');
                result = dateArray[1] + "/" + dateArray[0] + "/"+ dateArray[2]
                parameters = parameters + "&" + foundItem.rbField + "=" + result;
                return;
            }
          }

          return null;
        }

        function setBinaryData(sessionId, createdRecordId, fieldName, binaryData, extension) {
          return new Promise(function (resolve, reject) {
              var binaryOptions = {
                method: 'POST',
                uri: 'https://cloudapps.services/rest/api/setBinaryData?sessionId=' + sessionId + '&id=' + createdRecordId + '&fieldName=' + fieldName + '&fileName=' + fileName + '.' + extension + '&contentType=application/' + extension + '&output=json',
                formData: {
                  value: binaryData
                }
              };
              logger_2.info(binaryOptions);
              rp(binaryOptions)
                .then(function (binaryResponse) {
                  logger_nextens.info("Inside setBinaryData :: ")
                  logger_nextens.info(binaryResponse)
                  resolve(binaryResponse);
                })
                .catch(function (err) {
                  logger_nextens.info("Inside setBinaryData");
                  logger_nextens.error(err);
                  var obj = JSON.parse(err.error);
                  reject(obj);
                })
          })
        }

        function sendResponse(toggle, callback) {
          if (toggle == true) {
            if (P_toggle == true) {
              var MongoClient = require('mongodb').MongoClient;
              var database = 'nextens';
              createdRecordId = createdRecordId.toString();
              MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
                db.collection("soap").insert({ Succes: 1, ServerKenmerk: createdRecordId, StatusDocument: 'sdGeupload', MetPartner: true, OTPKenmerkAangever: '', OTPTijdStempelAangever: serverRequestedDate, OTPKenmerkPartner: '', OTPTijdStempelPartner: '' }, function (mongoErr, result) {
                  var responseObj = { UploadDocumentsResult: { Succes: 1, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: true, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId } };
                  callback(responseObj);
                  db.close();
                })
              })
            } else {
              var MongoClient = require('mongodb').MongoClient;
              var database = 'nextens';
              createdRecordId = createdRecordId.toString();
              MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
                db.collection("soap").insert({ Succes: 1, ServerKenmerk: createdRecordId, StatusDocument: 'sdGeupload', MetPartner: false, OTPKenmerkAangever: '', OTPTijdStempelAangever: serverRequestedDate, OTPKenmerkPartner: '', OTPTijdStempelPartner: '' }, function (mongoErr, result) {
                  var responseObj = { UploadDocumentsResult: { Succes: 1, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId } };
                  callback(responseObj);
                  db.close();
                })
              })
            }
          }
        }

        function sendErrorResponse(tog, err, callback) {
          if (tog == true) {
            var MongoClient = require('mongodb').MongoClient;
            var database = 'nextens';
            createdRecordId = createdRecordId.toString();
            MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
              db.collection("soap").insert({ Succes: 0, ServerKenmerk: createdRecordId, StatusDocument: 'sdGeupload', MetPartner: false, OTPKenmerkAangever: '', OTPTijdStempelAangever: serverRequestedDate, OTPKenmerkPartner: '', OTPTijdStempelPartner: '', FoutMelding: '' + err + '' }, function (mongoErr, result) {

                var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId, FoutMelding: '' + err + '' } };
                callback(responseObj);
                db.close();
              })
            })
          } else {
            var MongoClient = require('mongodb').MongoClient;
            var database = 'nextens';
            createdRecordId = createdRecordId.toString();
            MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
              db.collection("soap").insert({ Succes: 0, ServerKenmerk: createdRecordId, StatusDocument: 'sdGeupload', MetPartner: false, OTPKenmerkAangever: '', OTPTijdStempelAangever: serverRequestedDate, OTPKenmerkPartner: '', OTPTijdStempelPartner: '', FoutMelding: '' + err + '' }, function (mongoErr, result) {

                var responseObj = { UploadDocumentsResult: { Succes: 0, Klaar: Klaar, EigenKenmerk: U_EigenKenmerk, ServiceRequested: U_ServiceRequested, PI_Kenmerk: U_PI_Kenmerk, MetPartner: false, TijdStempel: serverRequestedDate, ServerKenmerk: createdRecordId, FoutMelding: '' + err + '' } };
                callback(responseObj);
                db.close();
              })
            })
          }
        }

      },
      GetStatus: function (args, callback) {
        var ServerKenmerk;
        if ('ServerKenmerk' in args) {
          ServerKenmerk = args.ServerKenmerk;
          //ServerKenmerk = JSON.parse(ServerKenmerk);
          var MongoClient = require('mongodb').MongoClient;
          var database = 'nextens';

          MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
            db.collection("soap").findOne({ ServerKenmerk: ServerKenmerk }, { '_id': 0 }, function (err, result) {

              if (result == null) {
                var responseObj = { GetStatusResult: { Succes: 0, ServerKenmerk: '', StatusDocument: '', MetPartner: false, OTPKenmerkAangever: '', OTPTijdStempelAangever: '', OTPKenmerkPartner: '', OTPTijdStempelPartner: '', FoutMelding: 'No record found' } };
                callback(responseObj);
              } else {
                if ('FoutMelding' in result) {
                  if (result.FoutMelding != '') {
                    var responseObj = { GetStatusResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner, FoutMelding: result.FoutMelding } };
                    callback(responseObj);
                  } else {
                    var responseObj = { GetStatusResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner } };
                    callback(responseObj);
                  }
                } else {
                  var responseObj = { GetStatusResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner } };
                  callback(responseObj);
                }
                db.close();
              }
            })
          })
        } else {
          var responseObj = { GetStatusResult: { Succes: 0, ServerKenmerk: '', StatusDocument: '', MetPartner: false, OTPKenmerkAangever: '', OTPTijdStempelAangever: '', OTPKenmerkPartner: '', OTPTijdStempelPartner: '', FoutMelding: 'ServerKenmerk is required' } };
          callback(responseObj);
        }

      },
      GetStatusExt: function (args, callback) {

        var ServerKenmerk;
        if ('ServerKenmerk' in args) {
          ServerKenmerk = args.ServerKenmerk;
          //ServerKenmerk = JSON.parse(ServerKenmerk);
          var MongoClient = require('mongodb').MongoClient;
          var database = 'nextens';

          MongoClient.connect('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/' + database + '?authSource=admin', function (mongoConnErr, db) {
            db.collection("soap").findOne({ ServerKenmerk: ServerKenmerk }, { '_id': 0 }, function (err, result) {

              if (result == null) {
                var responseObj = { GetStatusExtResult: { Succes: 0, ServerKenmerk: '', StatusDocument: '', MetPartner: false, FoutMelding: 'No record found' } };
                callback(responseObj);
              } else {
                if ('FoutMelding' in result) {
                  if (result.FoutMelding != '') {
                    var responseObj = { GetStatusExtResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner, FoutMelding: result.FoutMelding } };
                    callback(responseObj);
                  } else {
                    var responseObj = { GetStatusExtResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner } };
                    callback(responseObj);
                  }
                } else {
                  var responseObj = { GetStatusExtResult: { Succes: 1, ServerKenmerk: result.ServerKenmerk, StatusDocument: result.StatusDocument, MetPartner: result.MetPartner } };
                  callback(responseObj);
                }

              }
              db.close();
            })
          })
        } else {
          var responseObj = { GetStatusExtResult: { Succes: 0, ServerKenmerk: '', StatusDocument: '', MetPartner: false, FoutMelding: 'ServerKenmerk is required' } };
          callback(responseObj);
        }
      }

    }
  }
}


// xml data is extracted from wsdl file created
var xml = require('fs').readFileSync('./uploadService.wsdl', 'utf8');

// end soap setup

app.use(bodyParser.json({ limit: '16mb' }));
app.use(cookieParser());

// setup session
app.use(session({
  secret: '858SGTUyX8w1L6JNm1m93Cvm8uX1QX2D',
  resave: true,
  saveUninitialized: true
}));

// front-end modules loaded from NPM
app.use(app_context + '/static', express.static(path.join(dir_base, 'public/')));
app.use(app_context + '/font-awesome', express.static(path.join(dir_base, 'node_modules/font-awesome/')));
app.use(app_context + '/jquery', express.static(path.join(dir_base, 'node_modules/jquery/dist/')));
app.use(app_context + '/bootstrap', express.static(path.join(dir_base, 'node_modules/bootstrap/dist/')));
app.use(app_context + '/css', express.static(path.join(dir_base, 'public/css')));
app.use(app_context + '/fonts', express.static(path.join(dir_base, 'public/fonts')));
app.use(app_context + '/js', express.static(path.join(dir_base, 'public/js')));
app.use(app_context + '/favicon.ico', express.static(path.join(dir_base, 'public/favicon.ico')));

// Make stuff accessible to our router
app.use(function (req, res, next) {
  req.nconf = nconf.stores;
  req.handlebars = handlebars;
  req.i18n = i18n;
  req.app_context = app_context;
  req.db = db;
  next();
});

// add context to route if required
if (app_context !== '') {
  app.use(app_context, apiRoute);
  app.use(app_context, usersRoute);
  app.use(app_context, configRoute);
  app.use(app_context, docRoute);
  app.use(app_context, dbRoute);
  app.use(app_context, collectionRoute);
  app.use(app_context, indexRoute);
} else {
  app.use('/', apiRoute);
  app.use('/', usersRoute);
  app.use('/', configRoute);
  app.use('/', docRoute);
  app.use('/', dbRoute);
  app.use('/', collectionRoute);
  app.use('/', indexRoute);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  logger_2.error(err);
  next(err);
});

// === Error handlers ===

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      helpers: handlebars.helpers
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    helpers: handlebars.helpers
  });
});

app.on('uncaughtException', function (err) {
  console.error(err.stack);
  process.exit();
});

var https = require('https');
var sslConfig = require('./ssl-config');
// add the connections to the connection pool
var connection_list = nconf.stores.connections.get('connections');
var connPool = require('./connections');
var monitoring = require('./monitoring');
app.locals.dbConnections = null;

async.forEachOf(connection_list, function (value, key, callback) {
  var MongoURI = require('mongo-uri');

  try {
    MongoURI.parse(value.connection_string);
    connPool.addConnection({ connName: key, connString: value.connection_string, connOptions: value.connection_options }, app, function (err, data) {
      if (err) delete connection_list[key];
      callback();
    });
  } catch (err) {
    logger_2.error(err);
    callback();
  }
},
  function (err) {
    logger_2.error(err);
    if (err) console.error(err.message);
    // lift the app

    var server = null;
    //var algorithm = 'aes-256-ctr';
    //var privateKey = crypto.createDecipher(algorithm,sslConfig.privateKey);
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
      ca: sslConfig.cabundle
      //passphrase: 'Zehntech'
    };
    //server.setSecure(credentials);
    server = https.createServer(options, app);
    server.listen(app_port, function () {
      var baseUrl = 'https://' + app_host + ':' + app_port;
      app.emit('started', baseUrl);
      console.log('Mongo UI Interface listening on host: https://' + app_host + ':' + app_port + app_context);
      if (nconf.stores.app.get('app:monitoring') !== false) {
        // start the initial monitoring
        monitoring.serverMonitoring(db, app.locals.dbConnections);

        // Keep firing monitoring every 30 seconds
        setInterval(function () {
          monitoring.serverMonitoring(db, app.locals.dbConnections);
        }, 30000);
      }
    });

    //create an express server and pass it to a soap server
    soap.listen(server, '/uploadservice', service, xml);
    return server;
  });

module.exports = app;