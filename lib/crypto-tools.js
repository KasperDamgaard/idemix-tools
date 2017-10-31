/* jshint strict: true, node: true */

'use strict';

var errorHandler = new (require('./error-handler'))(false),
	tools = require('./tools'),
	strftime = require("strftime"),
	https = require('https'),
	http = require('http'),
	crypto = require("crypto");

module.exports = {
	makeBasicAuthHeader: function(user, password) {
		var tok = user + ':' + password;
		var hash = tools.base64encode(tok);
		return "Basic " + hash;
	},

	randomString: function(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) {
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		return result;
	},

	generateUid: function() {
		return this.randomString(34, '0123456789abcdefghijklmnopqrstuvwxyz');
	},

	generateServiceAuthorizationHeader: function(secure_connection, host_data, options, values) {
		errorHandler.debug("generateServiceAuthorizationHeader");

		var resultHeader = {};
		var date = strftime.strftimeUTC('%a, %d %b %Y %H:%M:%S GMT');
		var contentTypeString = '';
		var acceptStrign = '';
		var valuesSuffix = '';

		if (options.method == 'PUT' || options.method == 'POST' || options.method == 'DELETE') {
			if(options.headers === undefined || options.headers['Content-type'] === undefined){
				contentTypeString = 'Content-type:application/json;';
				resultHeader['Content-type'] = 'application/json';
			} else {
				contentTypeString = "Content-type:" + options.headers['Content-type'] + ";";
				resultHeader['Content-type'] = options.headers['Content-type'];
			}
			valuesSuffix = values;
		}

		if(options.headers === undefined || options.headers.Accept === undefined) {
			acceptStrign = "Accept:application/json;";
			resultHeader.Accept = 'application/json';
		} else {
			acceptStrign = "Accept:" + options.headers.Accept + ";";
			resultHeader.Accept = options.headers.Accept;
		}

		// Options object at this point already contains
		// evevrhting that we need for create sign to string
		// and two things we _actaully_ need from host_data
		// is secure_connection and secret but we still use
		// varialbes like host_data.port just for string
		// creatation simplification

		var protocolName = 'https';
		if(secure_connection !== undefined &&
				secure_connection === false) {
			protocolName = 'http';
		}

		var portString = '';
		if(host_data.port !== undefined) {
			portString = ':' + host_data.port;
		}

		var pathString = '';
		if(options.path === undefined || options.path === '') {
			pathString = '/';
		} else {
			pathString = options.path;
		}

		var stringToSign =
				options.method + ';' +
				protocolName + '://' +
				options.host +
				portString +
				pathString + ';' +
				contentTypeString +
				acceptStrign +
				'Date:' + date + ';' +
				valuesSuffix;

		errorHandler.debug("string to sign for authentication -> " + stringToSign);

		var signature = crypto.createHmac('sha256', host_data.secret).update(stringToSign).digest('base64');

		resultHeader.Date = date;
		resultHeader.Authorization = 'IdmxHMAC ' + signature;

		errorHandler.inspect('Request header', resultHeader);
		return resultHeader;
	},

	cryptoCallEndpoint: function(secure_connection, host_data, options, payload, callback) {

		errorHandler.inspect('Crypta Host data', host_data);

		var localOpts = tools.clone(options);
		localOpts.host = host_data.host;
		if(host_data.port !== undefined) {
			localOpts.port = host_data.port;
		}

		var pathString;
		if(localOpts.path !== undefined) {
			pathString = localOpts.path;
		} else {
			pathString = '/';
		}

		if(host_data.path !== undefined) {
			pathString = host_data.path + '/' + pathString;
		}

		localOpts.path = pathString;

		localOpts.headers = this.generateServiceAuthorizationHeader(secure_connection, host_data, localOpts, payload);

		var callMethod = https;
		if(secure_connection !== undefined &&
				secure_connection === false) {
			errorHandler.debug("Using HTTP instead of HTTPS!");
			callMethod = http;
		}

		errorHandler.inspect('Crypta request localOpts', localOpts);
		errorHandler.debug('Crypta request payload\n' + payload);

		var req = callMethod.request(
			localOpts,
			function (res) {
				res.body = '';
				res.setEncoding('utf8');
				res.on('data', function (read_data) {
						res.body += read_data;
				});
				res.on('end', function() {
					errorHandler.debug("Return status: " + res.statusCode);
					errorHandler.inspect('CryptoCall Response', res.body);

					callback(res.statusCode, res.body);
				});
				res.on('error', function(e) {
					errorHandler.error(e);
					callback(null, e);
				});
			}
		);

		req.on('error', function(e){
			errorHandler.error(e.message);
		});

		if(payload !== null && payload !== undefined && payload !== '') {
			req.write(payload);
		}
		req.end();
	},

	basicCallEndpoint: function(host_data, options, payload, callback, isHeaderRequired) {
		options.host = host_data.host;
		options.port = host_data.port;
		options.headers = {
			"Authorization": this.makeBasicAuthHeader(host_data.user,host_data.password),
			'Content-type':'application/json'
		};

		errorHandler.inspect('Request options', options);
		errorHandler.debug('Request payload\n' + payload);

		var req = http.request(
			options,
			function (res) {
				res.body = '';
				res.setEncoding('utf8');
				res.on('data', function (read_data) {
					res.body += read_data;
				});
				res.on('end', function() {
					errorHandler.debug("Return status: " + res.statusCode);
					errorHandler.inspect('CryptoCall Response', res.body);

					if (isHeaderRequired) {
						callback(res.statusCode, res.body, res.headers);
					} else {
						callback(res.statusCode, res.body);
					}
				});
				res.on('error', function(e) {
					errorHandler.error(e);
					callback(null, e);
				});
			}
		);

		req.on('error', function(e){
			errorHandler.error(e.message);
		});

		if(payload !== null && payload !== undefined && payload !== '') {
			req.write(payload);
		}
		req.end();
	}
};
