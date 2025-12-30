const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf, colorize, errors } = format;

const logger = createLogger({
    format: combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        printf(({ level, message, timestamp, stack }) => {
            if (stack) {
                return `${timestamp} ${level}: ${message} - ${stack}`;
            }
            return `${timestamp} ${level}: ${message}`;
        }),

    ),
    transports: [new transports.Console()],
});

module.exports = logger;