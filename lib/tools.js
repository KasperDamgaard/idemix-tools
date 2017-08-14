/* jshint strict: true, node: true */

'use strict';

var errorHandler = new (require('./error-handler'))(false),
	https = require('https'),
	crypto = require('crypto'),
	zlib = require('zlib'),
	strftime = require('strftime'),
	util = require('util');

module.exports = {

	uid: function() {
		return Math.floor((1 + Math.random()) * 0x10000)
				   .toString(16)
				   .substring(1);
	},

	clone: function(object) {
		return JSON.parse(JSON.stringify(object));
	},

	base64encode: function(data){
		return new Buffer(data).toString('base64');
	},

	base64decode: function(data) {
		return new Buffer(data, 'base64').toString('utf8');
	},

	generatePaswd: function(howMany, chars) {
		chars = chars ||
			"abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
		var rnd = crypto.randomBytes(howMany),
			value = new Array(howMany),
			len = chars.length;

		for (var i = 0; i < howMany; i++) {
			value[i] = chars[rnd[i] % len];
		}

		return value.join('');
	},

	formatDateTime: function(s) {
		var chunks = s.split(/[-T:]/g);
		return chunks[0] + '-' + chunks[1] + '-' + chunks[2] + ' ' + chunks[3] + ':' + chunks[4];
	},

	parseBasicAuthCredentials: function(req) {
		var fullHeader = req.headers.authorization;
		if (fullHeader) {
			var credentials = {};
			var authPattern = new RegExp(/Basic (.*)/);
			var matches = fullHeader.match(authPattern);
			var headerVal = this.base64decode(matches[1]);
			var parts = headerVal.split(':');
			credentials.login = parts[0];
			credentials.password = parts[1];
			return credentials;
		}
		return null;
	},

	gzipAndBase64encode: function(toGzipAndBase64Encode, callback) {
		errorHandler.debug("Start gzipping...");
		zlib.gzip(toGzipAndBase64Encode, function(err, gzipped) {
		  if (err) callback(err);

		  errorHandler.debug("Gzipping done.");
		  errorHandler.debug("Start base64 encoding...");
		  var gzippedAndb64encoded = gzipped.toString('base64');
		  errorHandler.debug("Base64 encoding done.");
		  callback(null, gzippedAndb64encoded);
		});
	},

	base64decodeAndUnzip: function(toDecodeAndUnzip, callback) {
		errorHandler.debug("Start base64 decoding...");
		var toUnzip = new Buffer(toDecodeAndUnzip, 'base64');
		errorHandler.debug("Base64 decoding done.");
		errorHandler.debug("Start unzipping...");
		zlib.unzip(toUnzip, function(err, buffer) {
			if (err) {
				callback(err);
			}
			errorHandler.debug("Unzipping done.");
			callback(null, buffer.toString());
		});
	},

	unzipUTF8Buffer: function(buf, callback) {
		zlib.unzip(buf, function(err, data) {
			if (!err) {
				callback(null, data.toString('utf8'));
			} else {
				callback(err);
			}
		});
	},

	parseHeader: function(header) {
		var policyPattern = new RegExp(/policy=(.*?),/);
		var noncePattern = new RegExp(/nonce=(.*?),/);
		var verifierPattern = new RegExp(/verifier-identity=(.*?),/);
		var verifierUrlPattern = new RegExp(/verifier-url=(.*?),/);
		var matches = header.match(policyPattern);
		var authData = {};

		var decoded = this.base64decode(matches[1]);

		try{
			authData.policy = JSON.parse(decoded);
		} catch (err) {
			errorHandler.debug("Parse header error:" + err);
		}

		matches = header.match(noncePattern);
		authData.nonce = this.base64decode(matches[1]);
		matches = header.match(verifierPattern);
		authData.verifier = this.base64decode(matches[1]);
		matches = header.match(verifierUrlPattern);
		authData.verifierUrl = this.base64decode(matches[1]);

		errorHandler.debug("parseHeader: OK");

		return authData;
	},

	makeBasicAuthHeader: function(user, password) {
		var tok = user + ':' + password;
		var hash = this.base64encode(tok);
		return "Basic " + hash;
	}
};
