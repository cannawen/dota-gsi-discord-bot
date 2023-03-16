import colors from "@colors/colors";
import winston from "winston";

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

const DISCORD_LEVEL = "info";
const GSI_LEVEL = "info";

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
    return `${info.timestamp} ${info.level}: ${info.label} ${info.message}${info.splat ? `${info.splat}` : " "}`;
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

winston.loggers.add("discord", {
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   colors.blue("[DISCORD]\t"),
            message: false,
        })
    ),
    level:      DISCORD_LEVEL,
    transports: createTransports(),
});

winston.loggers.add("gsi", {
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   colors.magenta("[GSI]\t\t"),
            message: false,
        })
    ),
    level:      GSI_LEVEL,
    transports: createTransports(),
});

const discordLog = winston.loggers.get("discord");
const gsiLog = winston.loggers.get("gsi");

export default winston;
export {
    discordLog,
    gsiLog,
};
