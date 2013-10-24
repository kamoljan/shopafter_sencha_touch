var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

var sign= require('./lib/sign');

// Global includes
conf = require('./lib/conf').conf;

app.use(express.logger("dev"));  // Log output like "200"
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

// FIXME: SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.post('/signing', sign.signing);

app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
