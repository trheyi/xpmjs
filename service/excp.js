
function Excp( message, code, extra ) {
	this.message = message || 'unknown error';
	this.code = code || 500;
	this.extra = extra || {};

	this.getCode = function() {
		return this.code;
	}

	this.getMessage = function() {
		return this.message;
	}

	this.getExtra = function() {
		return this.extra;
	}
}


module.exports = Excp;