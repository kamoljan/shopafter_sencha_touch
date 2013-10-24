var express = require('express'),
    http = require('http'),
    path = require('path'),
    crypto = require('crypto'),
    app = express();

var aws = {
        "accessKeyId": "AKIAJKZ3C6AHMVUUMXMQ",
        "secretAccessKey": "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",
        "region": "ap-southeast-1",
        "s3_bucket": "android.shopafter.com",
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

    console.log('aws.region = ' + aws.region);
    console.log('aws.s3_bucket = ' + aws.s3_bucket);
    console.log('aws.accessKeyId = ' + aws.accessKeyId);
    console.log('policyBase64 = ' + policyBase64);
    console.log('signature = ' + signature);
}

// FIXME: SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.post('/signing', sign);

app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
