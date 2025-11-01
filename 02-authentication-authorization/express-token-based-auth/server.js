import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());

// connect database
connectDB();

// routes
app.get("/", (req, res) => {
	res.send("Welcome!");
});

// listening to server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running at - http://localhost:${PORT}`);
});
