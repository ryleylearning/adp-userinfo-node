'use strict';

var server = require('./server');

server.start(function startCb() {
	console.log('Server started callback');
});
