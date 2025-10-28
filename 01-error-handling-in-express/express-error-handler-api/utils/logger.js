import winston from "winston";

// create a logger instance
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console(), // show logs in the terminal
		new winston.transports.File({ filename: "logs/error.log", level: "error" }), // save errors
		new winston.transports.File({ filename: "logs/combined.log" }), // save all logs
	],
});

export default logger;
