import colors from "@colors/colors";
import winston from "winston";

const DISCORD_LOG_LEVEL_VERBOSE = false;
const GSI_LOG_LEVEL_VERBOSE = false;

const timeFormat = winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
});

const defaultFormatArray = [
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json(),
    timeFormat,
];

function printFormat(info: winston.Logform.TransformableInfo) {
    return `${info.timestamp} ${info.level}\t${info.label}\t${info.message}${info.splat ? `${info.splat}` : " "}`;
}

function createTransports() {
    return [
        new winston.transports.File({
            filename: "error.log",
            format:   winston.format.combine(
                timeFormat,
                winston.format.printf((info) => colors.stripColors(printFormat(info))),
            ),
            level: "error",
        }),
        new winston.transports.File({
            filename: "combined.log",
            format:   winston.format.combine(
                timeFormat,
                winston.format.printf((info) => colors.stripColors(printFormat(info))),
            ),
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                timeFormat,
                winston.format.printf(printFormat)
            ),
        }),
    ];
}

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

const discordLog = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   colors.blue("[DISCORD]"),
            message: false,
        })
    ),
    level:      DISCORD_LOG_LEVEL_VERBOSE ? "verbose" : "info",
    transports: createTransports(),
});

const gsiLog = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   colors.magenta("[GSI]\t"),
            message: false,
        })
    ),
    level:      GSI_LOG_LEVEL_VERBOSE ? "verbose" : "info",
    transports: createTransports(),
});

// not sure why we need to add loggers to a container, but it's what the winston README does
winston.loggers.add("discord", discordLog);
winston.loggers.add("gsi", gsiLog);

export default winston;
export {
    discordLog,
    gsiLog,
};
