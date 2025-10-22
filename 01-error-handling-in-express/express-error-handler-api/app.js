import express from "express";
import globalErrorhandler, {
	handleNotFound,
} from "./middleware/globalErrorHandler";
import catchAsync from "./utils/catchAsync";
import AppError from "./utils/AppError";

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
	"/",
	catchAsync(async (req, res, next) => {
		// simulate async failure
		throw new AppError("This is async error!", 500);
	})
);

// For unhandled routes
app.all("*", handleNotFound);

// Global error middleware
app.use(globalErrorhandler);

export default app;
