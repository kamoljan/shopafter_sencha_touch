var crypto = require('crypto');

exports.signing = function (req, res, next) {
    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(),  // 5 min
        policy =
        {
            "expiration": expiration,
            "conditions": [
                {"bucket": conf.aws.s3_bucket},
                {"key": fileName},
                {"acl": "public-read"},
                ["starts-with", "$Content-Type", ""],
                ["content-length-range", 0, 2097152000]  // 512K*4
            ]
        },
        policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64'),
        signature = crypto.createHmac('sha1', conf.aws.secretAccessKey).update(policyBase64).digest('base64');

    res.json({
        region: conf.aws.region,
        bucket: conf.aws.s3_bucket,
        awsKey: conf.aws.accessKeyId,
        policy: policyBase64,
        signature: signature
    });
}
