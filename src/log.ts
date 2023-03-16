import colors from "@colors/colors";
import winston from "winston";

const DISCORD_LOG_LEVEL_DEBUG = false;
const GSI_LOG_LEVEL_DEBUG = false;

function padTo(msg: string, length: number, truncate: boolean) {
    const stripped = colors.stripColors(msg);
    if (stripped.length < length) {
        const endPadLength = length - stripped.length;
        const endPadString = " ".repeat(endPadLength);
        return `${msg}${endPadString}`;
    } else if (truncate) {
        // Big assumption that this string has a color at the start
        // It takes this one color and sets it for the rest of the string
        return msg.slice(0, 5) + stripped.slice(0, length);
    } else {
        return msg;
    }
}

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
    const levelLength = 5;
    const labelLength = 9;
    return `${info.timestamp.gray} ${padTo(info.level, levelLength, true)} ${padTo(info.label, labelLength, false)} ${info.message}${info.splat ? `${info.splat}` : " "}`;
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
            level: "debug",
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
            label:   "[DISCORD]".blue,
            message: false,
        })
    ),
    level:      DISCORD_LOG_LEVEL_DEBUG ? "debug" : "info",
    transports: createTransports(),
});

const gsiLog = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "[GSI]".magenta,
            message: false,
        })
    ),
    level:      GSI_LOG_LEVEL_DEBUG ? "debug" : "info",
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
