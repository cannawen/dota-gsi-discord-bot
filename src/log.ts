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

const defaultFormatArray = [
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json(),
];

function createTransports() {
    return [
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
    ];
}

winston.loggers.add("discord", {
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "DISCORD",
            message: true,
        })
    ),
    level:      DISCORD_LEVEL,
    transports: createTransports(),
});

winston.loggers.add("gsi", {
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "GSI",
            message: true,
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
