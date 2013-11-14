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
    var options = {
        select: 'report'
    };
    /**
     * http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
     **/
    Ad.findByIdAndUpdate(
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