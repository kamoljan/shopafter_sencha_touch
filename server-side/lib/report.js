exports.reporting = function (req, res, next) {
    console.log("(report): reporting");
    var query = {
        "_id": mongoose.Types.ObjectId(req.param('id'))
    };
    var update = {
        $inc: {
            "report": 1
        }
    };
    /**
     * new: boolean}} true to return the modified document rather than the original. defaults to true
     * upsert: boolean}} creates the object if it doesn't exist. defaults to false.
     * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
     * select: sets the document fields to return
     */
    var options = {
        select: 'report'
    };
    Ad.findOneAndUpdate(
        query,
        update,
        options,
        function (err, report) {
            if (!err) {
                res.json({ success: true });
                console.log("(report) report = " + report);
            } else {
                res.json({ success: false });
                console.log("(report) err = " + err);
                console.log("(report) query = " + query);
                console.log("(report) update = " + update);
                console.log("(report) options = " + options);
            }
        }
    );
};