var async = require('async'),
    handleError = require('./error').handleError;

exports.posting = function (req, res, next) {
    console.log("(ad): adding");

    async.waterfall([
        function (callback) {
            console.log("(ad): async.waterfall started");
            console.log("(ad): req.body = " + JSON.stringify(req.body));
            // Construct a new Ad using the post data
            var ad = new Ad({
                image: req.body.photo,
                thumb: req.body.photo,
                category: req.body.category,
                description: req.body.description,
                price: req.body.price,
                phone: req.body.phone,
                loc: [req.body.longitude, req.body.latitude],
                date: new Date
            });

            // Save the ad to the database
            ad.save(function (err) {
                if (err) {
                    handleError('Could not save ad', err, req, res);
                    return;
                }
                console.log("Successfully saved new ad");
                res.json({ success: true });
            })
        }
    ]);
};