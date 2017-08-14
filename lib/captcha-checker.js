var https = require('https');


function captchaChecker(private_key) {
	this.private_key = private_key;
	this.google_url = 'www.google.com';
}

captchaChecker.prototype.checkRecaptcha = function(ip, response, callback) {

	var options = {
		host: this.google_url,
		path: '/recaptcha/api/siteverify?secret=' + this.private_key +
			'&response=' + response +
			'&remoteip=' + ip,
		method: 'POST'
	};

	var req = https.request(
		options,
		function (res) {
			res.body = "";
			res.setEncoding('utf8');
			res.on('data', function (read_data) {
				res.body += read_data;
			});
			res.on('end', function() {
				if(res.statusCode == 200) {
					console.log("We've got Re-Captcha response: " + res.body);
					try {
						var response = JSON.parse(res.body);
						callback(response.success);
					} catch (e) {
						console.error(e);
						callback(false);
					}
				} else {
					console.error("We've got bad Re-Captcha response status: "+ res.body);
					callback(false);
				}
			});
			res.on('error', function(e) {
				console.error("We've got error while Re-Captcha response: "+ e);
				callback(false);
			});
		}
	);

	req.on('error', function(e){
		console.log("We've got error while Re-Captcha request: " + e);
		callback(false);
	});

	req.end();
};


captchaChecker.prototype.checkRecaptcha_v1 = function(ip, response, challenge, callback) {

	var options = {
        host: this.google_url,
        path: '/recaptcha/api/verify?privatekey=' + this.private_key +
            '&remoteip=' + ip +
            '&challenge=' + challenge +
            '&response=' + escape(response),
        method: 'POST'
    };

    var req = https.request(
        options,
        function (res) {
			res.body = "";
			res.setEncoding('utf8');
			res.on('data', function (read_data) {
				res.body += read_data;
			});
			res.on('end', function() {
				if(res.statusCode == 200) {
					console.log("We've got Re-Captcha response: " + res.body);
					try {
						callback(res.body);
					} catch (e) {
						console.error(e);
						callback(false);
					}
				} else {
					console.error("We've got bad Re-Captcha response status: "+ res.body);
					callback(false);
				}
			});
			res.on('error', function(e) {
				console.error("We've got error while Re-Captcha response: "+ e);
				callback(false);
			});
        }
    );

    req.on('error', function(e){
        errorHandler.inspect("We've got error while Re-Captcha request: ", e);
        errorHandler.error(e.message);
        callback(false);
    });

    req.end();

};

module.exports = captchaChecker;
