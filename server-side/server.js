var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

var sign = require('./lib/sign'),
    ad = require('./lib/ad');

// Global includes
conf = require('./lib/conf').conf;
db = require('./lib/database');

app.use(express.logger("dev"));  // Log output like "200"
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.compress());
app.use(app.router);

// FIXME: SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.post('/sign', sign.signing);
app.post('/ad', ad.posting);
app.get('/search', ad.searching);
app.options('/search', ad.searching);  // FIXME: find out why it sends OPTIONS method?
app.get('/ad/:id', ad.viewing);

app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
