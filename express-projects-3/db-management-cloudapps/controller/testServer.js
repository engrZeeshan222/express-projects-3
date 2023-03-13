module.exports = {
    testServer
};
function testServer(req, res, next){
    return res.status(200).send({status:"connected"});   
}