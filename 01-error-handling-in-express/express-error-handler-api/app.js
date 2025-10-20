const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Express Error Handling Project Initialized ✅");
});

export default app;
