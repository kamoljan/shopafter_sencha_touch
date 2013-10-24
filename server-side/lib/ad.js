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

exports.searching = function (req, res, next) {
    console.log("(ad): searching");

    // pagination
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    // filter
    var q = new RegExp(req.query.q, 'i');  // 'i' makes it case insensitive
    var category = req.query.category || 0;

    var query = {};
//    if (req.query.sort && req.query.sort.match(/Date/i)) {
//        query['sort'] = 'date';
//    } else if (req.query.sort && req.query.sort.match(/Location/)) {
//        query['sort'] = 'price';
//    }

    console.log('server page is = ' + page);
    console.log('server limit is = ' + limit);
    console.log('server q is = ' + q);
    console.log('server category is = ' + category);

    if (q) {
        query['description'] = q;
    }
    if (category !== 0) {
        query['category'] = category;
    }
    console.log('server query is = %j', query);

    Ad.paginate(query, page, limit, function (error, pageCount, paginatedResults) {
        if (error) {
            console.error(error);
        } else {
            console.log('server pageCount ' + pageCount);
            res.send({ "ads": paginatedResults, "pageCount": pageCount });
        }
    });
};

exports.viewing = function (req, res, next) {
    console.log("(ad): viewing");
    return Ad.find({ "_id": req.params.id }, function (err, ads) {
        if (!err) {
            res.send({ "ads": ads, "total": 1 });
        } else {
            res.send("Ad not found", 404);
        }
    });
};

