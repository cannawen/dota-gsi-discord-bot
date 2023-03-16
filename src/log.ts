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

const LOG_LEVEL = "info";
const DISCORD_LOG_LEVEL = "info";
const GSI_LOG_LEVEL = "info";

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

const log = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "GENERAL",
            message: true,
        })
    ),
    level:      LOG_LEVEL,
    transports: createTransports(),
});

const discordLog = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "DISCORD",
            message: true,
        })
    ),
    level:      DISCORD_LOG_LEVEL,
    transports: createTransports(),
});

const gsiLog = winston.createLogger({
    format: winston.format.combine(
        ...defaultFormatArray,
        winston.format.label({
            label:   "GSI    ",
            message: true,
        })
    ),
    level:      GSI_LOG_LEVEL,
    transports: createTransports(),
});

export default log;
export {
    discordLog,
    gsiLog,
    log,
};
