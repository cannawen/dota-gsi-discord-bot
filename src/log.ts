import winston from "winston";

const baseLoggerConfig = {
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple(),
        winston.format.json(),
    ),
    level:      "info",
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level:    "error",
        }),
        new winston.transports.File({
            filename: "combined.log",
        }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
};

const baseLoggerConfig2 = {
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple(),
        winston.format.json(),
    ),
    level:      "info",
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level:    "error",
        }),
        new winston.transports.File({
            filename: "combined.log",
        }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
};

// Available levels
// {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
// }

const log = winston.createLogger(baseLoggerConfig);
log.level = "info";

const discordLog = winston.createLogger(baseLoggerConfig2);
discordLog.format = winston.format.combine(
    discordLog.format,
    winston.format.label({
        label:   "Discord",
        message: true,
    }),
);
discordLog.level = "error";

export default log;
export {
    discordLog,
    log,
};
