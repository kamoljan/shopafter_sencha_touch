var http = require('http');
var _ = require('underscore'),
    express = require('express'),
    connect = require('connect'),
    rest = require('restler'),
    MongoStore = require('connect-mongo')(express);

var AWS = require('aws-sdk'),
    nodeUtil = require('util'),
    async = require('async'),
    crypto = require('crypto');

// Global includes
config = require('./config').config;
require('./lib/database');

//console.log(config);

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,  //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.secretAccessKey,  //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: config.aws.region,  //region: process.env.AWS_REGION
    sslEnabled: config.aws.sslEnabled
});

var app = express();
app.use(express.compress());
var httpServer = http.createServer(app).listen(9999);
httpServer.on('error', function () {
    console.log("Error in Listening on port 9999" + message);
});

app.get('/ad', function (req, res) {
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
    if (category) {
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
});

var s3 = new AWS.S3();

/**
 * Put image into s3
 */
app.put('/upload', function (req, res, next) {
    async.waterfall([
        function (callback) {
            var data = req.body.file;
            console.log('(put image) data = ' + data);
            var key = crypto.createHash('md5').update(data).digest("hex");
            var base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
            base64Data += base64Data.replace('+', ' ');
            var binaryData = new Buffer(base64Data, 'base64');
            var obj = {
                Bucket: config.aws.s3_bucket,
                ACL: 'public-read',
                Key: key,
                Body: binaryData,
                ContentType: 'image/jpeg'
            };
            var imgUrl = nodeUtil.format('https://s3-%s.amazonaws.com/%s/%s',
                config.aws.region, config.aws.s3_bucket, key);
            callback(null, obj, data, imgUrl);
        },

        function (obj, data, imgUrl, callback) {
            s3.client.putObject(obj, function (err, data, next) {
                if (err) {
                    console.log("(put image) Got error:", err.message);
                    console.log("(put image) Request:");
                    console.log(this.request.httpRequest);
                    console.log("(put image) Response:");
                    console.log(this.httpResponse);
                    return;  // exit if err
                } else {
                    console.log("(put image): waterfall no err ");
                    console.log("(put image): imgUrl = " + imgUrl);
                    res.send(imgUrl);
                }
                console.log("(put image): waterfall end of s3 ");
            })
        }
    ], function (err, result) {
            console.log("(put image): async.waterfall function (err, result)-> result " + result);
            console.log("(put image): async.waterfall function (err, result)-> err " + err);
        }
    );  // end async
});

/**
 * Ad view
 */
app.get('/ad/:id', function (req, res, next) {
    return Ad.find({ "_id": req.params.id }, function (err, ads) {
        if (!err) {
            res.send({ "ads": ads, "total": 1 });
        } else {
            res.send("Ad not found", 404);
        }
    });
});

