import express from "express";
import globalErrorhandler, {
	handleNotFound,
} from "./middleware/globalErrorHandler";

const app = express();

app.use(express.json());

// All routes goes here...
app.get("/", (req, res) => {
	res.send("Express Error Handling Project Initialized ✅");
});

/**
 * More routes will be come here, in future...
 **/

// For unhandled routes
app.all("*", handleNotFound);

// Global error middleware
app.use(globalErrorhandler);

export default app;
