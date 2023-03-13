module.exports = function(req,res,next) {

    var MongoClient = require('mongodb').MongoClient;
    // Connection URL
    var url = 'mongodb://superAdmin1:Qwerty12345!@127.0.0.1:61725/telerik?authSource=admin';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, conn) {
        conn.createRole(
            {
                role: "app_user",
                privileges: [
                    {
                        resource: {db: "telerik", collection: "app_user"},
                        actions: ["find", "update", "insert", "remove"]
                    },
                    {resource: {db: "telerik", collection: "appointments"}, actions: ["remove"]}
                ],
                roles: []
            }
        )
    });

    return res.status().send("data created");
};
