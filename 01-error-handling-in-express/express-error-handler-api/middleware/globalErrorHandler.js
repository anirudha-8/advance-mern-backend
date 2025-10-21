/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 **/

import AppError from "../utils/AppError";

const globalErrorhandler = (err, req, res, next) => {
	// set default values
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "error";

	// send error response
	res.status(err.statusCode).json({ status: err.status, message: err.message });
};

// Handle unhandled routes (404)
export const handleNotFound = (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 400));
};

export default globalErrorhandler;
