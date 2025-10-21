/**
 * @class AppError
 * @extends Error
 * Custom error class for handling operational errors consistently
 * operational errors like - invalid input, missing route, etc.
 **/

class AppError extends Error {
	constructor(message, statusCode) {
		this(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		// Capture the stack trace and omit the constructor call from it
		Error.captureStakeTrace(this, this.constructor);
	}
}

export default AppError;
