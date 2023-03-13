var path = require('path'),
    fs = require("fs");

exports.privateKey = fs.readFileSync(path.join(__dirname, './private/certificate.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './private/certificate.crt')).toString();
exports.cabundle = fs.readFileSync(path.join(__dirname, './private/cabundle.crt')).toString();
