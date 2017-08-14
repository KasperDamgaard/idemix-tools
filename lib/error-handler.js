/* jshint node: true */

var util = require("util"),
	messages = require('./error-messages.js');

function errorHandler(debug_mode) {
	if(debug_mode !== undefined){
		this.debug_mode = debug_mode;
	} else {
		this.debug_mode = false;
	}
}

errorHandler.prototype.error = function(msg, errorCode) {
	var code;
	if(errorCode === undefined) {
		code = 'N/A';
	} else {
		code = errorCode;
	}

	console.error("IDEMIX ERROR: <" + code + ">: " + msg);
};

errorHandler.prototype.defError = function(errorCode) {
	this.error(messages[errorCode], errorCode);
};

errorHandler.prototype.warn = function(msg, errorCode) {
	var code;
	if(errorCode === undefined) {
		code = 'N/A';
	} else {
		code = errorCode;
	}

	console.warn("IDEMIX WARNING: <" + errorCode + ">: " + msg);
};

errorHandler.prototype.defWarn = function(warnCode) {
	this.warn(messages[warnCode], warnCode);
};

errorHandler.prototype.info = function(msg, errorCode) {
	var code;
	if(errorCode === undefined) {
		code = 'N/A';
	} else {
		code = errorCode;
	}

	console.info("IDEMIX INFO: <" + errorCode + ">: " + msg);
};

errorHandler.prototype.defInfo = function(infoCode) {
	this.info(messages[infoCode], infoCode);
};

errorHandler.prototype.inspect = function(msg, item) {
	if(this.debug_mode) {
		console.log("\n| IDEMIX INSPECT: " + msg);
		console.log("|___________________________________________|");
		console.log('| Item content:');
		console.log('| ' + JSON.stringify(item, undefined, 1));
		console.log("|___________________________________________|");
	}
};

errorHandler.prototype.debug = function(msg) {
	if(this.debug_mode) {
		this.print("IDEMIX DEBUG: " + msg);
	}
};

errorHandler.prototype.print = function(msg) {
	console.log('\n' + msg + '\n');
};

errorHandler.prototype.getMessage = function(code) {
	return code + " : " + messages[code];
};

errorHandler.prototype.getMessageText = function(code) {
	return messages[code];
};

module.exports = errorHandler;
