var async = require('async'),
    handleError = require('./error').handleError;

exports.reporting = function (req, res, next) {
    console.log("(report): reporting");
    console.log("(report): req.params = " + JSON.stringify(req.params));
    console.log("(report): req.body = " + JSON.stringify(req.body));
    console.log("(report): req.query = " + JSON.stringify(req.query));
    Ad.update(
        { "_id": req.query.id},
        { $inc: { "report": 1}},
        function (error, result) {
            console.log("(report) result = " + result);
            console.log("(report) error = " + error);
            res.json({ success: true });
        }
    );
};