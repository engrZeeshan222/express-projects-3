var fs = require('fs');

module.exports = {
    createpdf
};

var base64 = exports = {
    encode: function (unencoded) {
        return new Buffer(unencoded).toString('base64');
    },
};

async function createpdf(req, res, next) {
    try {
        var _images = req.body.imageBytes;
        var _uri = req.body.uri;
        var conversion = require("phantom-html-to-pdf")();
        var _htmlImages = "";
        for (let index = 0; index < _images.length; index++) {
            _htmlImages = _htmlImages + '<img src="data:image/png;base64,' + await base64.encode(_images[index]) + '" style="width: 800px; display: block; margin-left: auto; margin-right: auto;" />';
        }
        conversion({ html: _htmlImages }, function (err, pdf) {
            console.log("path : ");
            console.log(pdf.stream.path);
            var bitmap = fs.readFileSync(pdf.stream.path);
            var _pdfString = new Buffer(bitmap).toString('base64');
            const formData = {
                "value" : _pdfString
              };
            const request = require('request-promise');
            request.post({ url: _uri, formData: formData }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return res.status(500).json(err);
                }
                console.log('Upload successful!  Server responded with:', body);
                return res.status(200).json(body);
            });

        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
    //
}