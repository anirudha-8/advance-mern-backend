import express from "express";
import globalErrorhandler, {
	handleNotFound,
} from "./middleware/globalErrorHandler.js";
import catchAsync from "./utils/catchAsync.js";
import AppError from "./utils/AppError.js";

const app = express();

app.use(express.json());

// All routes goes here...
app.get("/", (req, res) => {
	res.send("Express Error Handling Project Initialized ✅");
});

/**
 * More routes will be come here, in future...
 **/

// demo route to simulate async failure
app.get(
	"/async-error-demo",
	catchAsync(async (req, res, next) => {
		// simulate async failure
		throw new AppError("This is async error!", 500);
	})
);

// Handle all undefined routes
app.use(handleNotFound);

// Centralized global error middleware
app.use(globalErrorhandler);

export default app;
