import fs from "fs";
import path from "path";
import winston from "winston";

const logsDir = path.join(process.cwd(), "logs");
// create logs directory if missing
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

const level =
	process.env.LOG_LEVEL ||
	(process.env.NODE_ENV === "production" ? "info" : "debug");

const myFormat = winston.format.printf(
	({ timestamp, level, message, stack, ...meta }) => {
		// if message is an object (e.g. Error), stringify it
		let msg = message;
		if (
			message &&
			typeof message === "object" &&
			!(message instanceof String)
		) {
			msg = JSON.stringify(message, Object.getOwnPropertyNames(message));
		}
		// include stack if present
		const extra = stack
			? `\n${stack}`
			: Object.keys(meta).length
			? ` ${JSON.stringify(meta)}`
			: "";
		return `[${timestamp}] ${level.toUpperCase()}: ${msg}${extra}`;
	}
);

const logger = winston.createLogger({
	level,
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.errors({ stack: true }), // capture stack when logging Error objects
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(logsDir, "error.log"),
			level: "error",
		}),
		new winston.transports.File({
			filename: path.join(logsDir, "combined.log"),
		}),
	],
	exceptionHandlers: [
		new winston.transports.File({
			filename: path.join(logsDir, "exceptions.log"),
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({
			filename: path.join(logsDir, "rejections.log"),
		}),
	],
});

export default logger;
