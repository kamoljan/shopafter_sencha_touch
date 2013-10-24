var async = require('async'),
    handleError = require('./error').handleError;

exports.posting = function (req, res, next) {
    console.log("(ad): adding");

    async.waterfall([

        function (callback) {
            console.log("(ad): async.waterfall started");
            console.log("(ad): req.body.name = " + req.body.name);
            console.log("(ad): req.body.photo = " + req.body.photo);
            console.log("(ad): req.body.category = " + req.body.category);
            console.log("(ad): req.body.description = " + req.body.description);
            console.log("(ad): req.body.price = " + req.body.price);
            console.log("(ad): req.body.phone = " + req.body.phone);
            console.log("(ad): req.body.latitude = " + req.body.latitude);
            console.log("(ad): req.body.longitude = " + req.body.longitude);
            console.log("(ad): req.body = " + JSON.stringify(req.body));
            // Construct a new Ad using the post data
            var ad = new Ad({
                //profileId: ,
                name: req.body.name,
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
    ]); // end async
}