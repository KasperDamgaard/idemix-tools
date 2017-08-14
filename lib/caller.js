/* jshint strict: true, node: true */

'use strict';

var url = require('url'),
	errorHandler = new (require('./error-handler'))(false);

function caller(){}

// callback (data, error)
caller.prototype.callEndpoint = function(target, options, payload, callback) {

	var protoCaller;
	var targetURL = url.parse(target);

	if (targetURL.protocol == 'https:'){
		protoCaller = require('https');
	} else if(targetURL.protocol == 'http:') {
		protoCaller = require('http');
	} else {
		callback("Unknown protocol. URL can not be called!");
		return;
	}

	options.host = targetURL.hostname;
	options.protocol = targetURL.protocol;
	if(targetURL.port) {
		options.port = targetURL.port;
	}

	var req = protoCaller.request(
		options,
		function (res) {
			res.body = '';
			res.setEncoding('utf8');
			res.on('data', function (read_data) {
				res.body += read_data;
			});
			res.on('end', function() {
				callback(null, res.body, res.statusCode);
			});
			res.on('error', function(e) {
				errorHandler.error("Error happened whil issuance step request!");
				errorHandler.error(e);
				callback(e);
			});
		}
	);

	req.on('error', function(e){
		errorHandler.error(e.message);
	});

	if(payload !==null) {
		req.write(payload);
	}
	req.end();

};

module.exports = caller;
