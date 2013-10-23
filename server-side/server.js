var express = require('express'),
    http = require('http'),
    path = require('path'),
    crypto = require('crypto'),
    app = express();

var aws = {
        "accessKeyId": "AKIAJVYDZS3ZM5UT4V4A",
        "secretAccessKey": "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",
        "region": "ap-southeast-1",
        "s3_bucket": "img.shopafter.com",
        "sslEnabled": false
    };

app.use(express.logger("dev"));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

function sign(req, res, next) {

    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(); // expire in 5 minutes

    console.log('expiration = ' + expiration);
    console.log('fileName = ' + fileName);

    var policy =
    {
        "expiration": expiration,
        "conditions": [
            {"bucket": aws.s3_bucket},
            {"key": fileName},
            {"acl": "public-read"},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 2097152000]  // 512K*4
        ]
    };
    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', aws.secretAccessKey).update(policyBase64).digest('base64');
    res.json({
        region: aws.region,
        bucket: aws.s3_bucket,
        awsKey: aws.accessKeyId,
        policy: policyBase64,
        signature: signature
    });

    console.log(JSON.stringify(res));
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
