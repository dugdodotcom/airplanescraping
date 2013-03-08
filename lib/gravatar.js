/*
	This is a very simple API wrapper for Gravatar.
	This should show you how easy it is to make API calls.
*/

var crypto = require('crypto');


exports.avatar = function(email, size) {
	var s  = (size)? size : 80;

	var shasum = crypto.createHash('md5');
	shasum.update(email.toLocaleLowerCase());
	var md5 = shasum.digest('hex');

	var url = "http://www.gravatar.com/avatar/" + md5 + ".jpg?s=" + s;

	return url;
}