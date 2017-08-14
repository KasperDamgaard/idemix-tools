var ua = require('universal-analytics');

function uinversalAnalytics(ua_id) {
	this.ua = ua(ua_id);
}

uinversalAnalytics.prototype.uaTrackPageView = function(path) {
	this.ua.pageview(path, function(err) {
		if(err) {
			console.log('UA Error! Path:' + path + ', Error: ' + err);
		}
	});
};

uinversalAnalytics.prototype.uaTrackEvent = function(category, action) {
	this.ua.event(category, action, function(err) {
		if(err) {
			console.log('UA Error! Action:' + action + ', Error: ' + err);
		}
	});
};

module.exports = uinversalAnalytics;
