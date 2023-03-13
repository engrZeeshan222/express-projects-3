module.exports = function(req,res,next) {
    if (req.headers['content-type'] != 'application/json') {
        return res.status(415).send({error: {statusCode: 415, message: 'Missing content-type'}});
    } else {
        next();
    }
};
