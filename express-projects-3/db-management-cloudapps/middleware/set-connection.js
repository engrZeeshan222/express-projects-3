var mongoose = require('mongoose');
module.exports = function(req,res,next) {
    var db = req.params.db;
    if(db == ' ' || '' || db.indexOf(' ') >= 0){
        return res.status(500).send({error: {statusCode: 500, message: 'Not connected with database'}});
    }
    //const table = req.params.collection;
    var options = {
        useMongoClient: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 0, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    };

    var conn =  mongoose.createConnection('mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/'+db+'?authSource=admin', options);
    if(conn){
        req.database = db;
        req.connection = conn;
        req.model = req.params.collection;
        next();
    }else {
        return res.status(500).send({error: {statusCode: 500, message: 'Not connected with database'}});
    }
}
