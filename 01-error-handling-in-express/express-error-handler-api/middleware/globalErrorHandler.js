import AppError from "../utils/AppError";

/**
 * Sends detailed error info during development
 */
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err,
	});
};

/**
 * Sends minimal error info during production
 */
const sendErrorProd = (err, res) => {
	// If the error is operational, send a safe message
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// Programming or unknown error: don't leak details
		res.status(err.statusCode).json({
			status: "error",
			message: "Something went wrong!",
		});
	}
};

/**
 * =========================================== *
 * ========= Mongoose Error Handling ========= *
 * =========================================== *
 */

// Mongoose CastError (Invalid ID format)
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

// Mongoose ValidationError (Schema validation fails)
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.json(". ")}`;
	return new AppError(message, 400);
};

// Mongoose Duplicate Key Error
const handleDuplicateFieldsDB = (err) => {
	const field = Object.keys(err.keyValue)[0];
	const value = err.keyValue[field];
	const message = `Duplicate field value: "${value}". Please, use another ${field}`;
	return new AppError(message, 400);
};

/**
 * ============================================ *
 * ============ JWT Error Handling ============ *
 * ============================================ *
 */

// Invalid JWT token
const handleJWTError = () => {
	new AppError("Invalid token. Please log in again!", 401);
};

// Expired JWT token
const handleJWTExpiredError = () => {
	new AppError("Your token has expired! Please log in again!", 401);
};

/**
 * Global Error Handling Middleware
 *
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 **/

const globalErrorhandler = (err, req, res, next) => {
	// set default values
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;

		// Handle specific MongoDB / Mongoose errors
		if (err.name === "CastError") {
			error = handleCastErrorDB(err);
		}
		if (err.name === "ValidationError") {
			error = handleValidationErrorDB(err);
		}
		if (err.code === 11000) {
			error = handleDuplicateFieldsDB(err);
		}

		// Handle JWT errors
		if (err.name === "JsonWebTokenError") {
			error = handleJWTError();
		}

		sendErrorProd(error, res);
	} else {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}
};

// Handle unhandled routes (404)
export const handleNotFound = (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 400));
};

export default globalErrorhandler;
