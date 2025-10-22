/**
 * Utility function to handle errors in async route handlers.
 * It forwards any thrown error to the global error handler.
 *
 * @param {Function} fn - The async route handler function
 * @param {Function} - A wrapped function with error forwarding.
 **/

const catchAsync = (fn) => {
	return (req, res, next) => {
		Promise.resolve(f(req, res, next)).catch(next);
	};
};

export default catchAsync;
