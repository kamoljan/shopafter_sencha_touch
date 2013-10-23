var express = require('express'),
    http = require('http'),
    path = require('path'),
    crypto = require('crypto'),
    app = express(),
    bucket = "img.shopafter.com",
    awsKey = "AKIAJVYDZS3ZM5UT4V4A",
    secret = "85Z8L0v5DlnLV6UWnXCUbxeE7Sak1JpXMjxNcg";

app.use(express.logger("dev"));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

function sign(req, res, next) {

    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(); // expire in 5 minutes

    var policy =
    {
        "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            {"key": fileName},
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 2097152000]  // 512K*4
        ]
    };
    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
}

// FIXME: SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.post('/signing', sign);

app.listen(3000, function () {
    console.log('Server listening on port 3000');
});


//// Global includes
//config = require('./config').config;
//require('./lib/database');
//
////console.log(config);
//
//AWS.config.update({
//    accessKeyId: config.aws.accessKeyId,  //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//    secretAccessKey: config.aws.secretAccessKey,  //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//    region: config.aws.region,  //region: process.env.AWS_REGION
//    sslEnabled: config.aws.sslEnabled
//});
//
