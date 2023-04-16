import { createLogger, format, transports } from "winston";
import config from "./config";

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const consoleTransport = new transports.Console();
const fileTransport = new transports.File({ filename: config.log.filePath });
const loggerTransports = config.developmentMode ? [consoleTransport] : [consoleTransport, fileTransport];

const logger = createLogger({
	level: config.log.level,
	format: combine(
		timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		customFormat
	),
	transports: loggerTransports,
});

export default logger;
