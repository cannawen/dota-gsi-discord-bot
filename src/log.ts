import colors from "@colors/colors";
import winston from "winston";
const { stylize, styles } = require("@colors/colors");

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

function printFormat(info: winston.Logform.TransformableInfo, colors: boolean) {
    const levelLength = 5;
    const labelLength = 9;
    const out = `${info.timestamp.gray} ${
        padTo(info.level, levelLength, true).stripColors
    } ${padTo(info.label, labelLength, false)} ${info.message}${
        info.splat ? `${info.splat}` : " "
    }`;
    if (colors) {
        return out;
    } else {
        return out.stripColors;
    }
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

function createMap(label: string, levelString: string) {
    return {
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.simple(),
            winston.format.json(),
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.label({
                label,
                message: false,
            })
        ),
        level: levelString,
        transports: [
            new winston.transports.File({
                filename: "error.log",
                format: winston.format.printf((info) =>
                    printFormat(info, false)
                ),
                level: "error",
            }),
            new winston.transports.File({
                filename: "combined.log",
                format: winston.format.printf((info) =>
                    printFormat(info, false)
                ),
                level: "debug",
            }),
            new winston.transports.Console({
                format: winston.format.printf((info) =>
                    printFormat(info, true)
                ),
            }),
        ],
    };
}

const loggers: Map<string, winston.Logger> = new Map();

function parseLogEnv(input: string) {
    // GSI:debug:magenta,DISCORD:warn
    const validColors = new Set(Object.keys(styles));
    const validLevels = new Set([
        "error",
        "warn",
        "info",
        "http",
        "verbose",
        "debug",
        "silly",
    ]);
    const settings = input
        .split(",")
        .map((single) => single.split(":"))
        .reduce(
            (memo, [label, level, color]) =>
                memo.set(label.toUpperCase(), {
                    color,
                    level,
                }),
            new Map()
        );

    return function (label: string) {
        const color = settings.get(label)?.color;
        const level = settings.get(label)?.level;
        return {
            color: validColors.has(color) ? color : "white",
            level: validLevels.has(level) ? level : "info",
        };
    };
}

function getLogger(label: string): winston.Logger {
    const settings = parseLogEnv(process.env.LOG || "");

    const existingLogger = loggers.get(label);

    if (existingLogger) {
        return existingLogger;
    } else {
        const newLogger = winston.createLogger(
            createMap(
                stylize(`[${label}]`, settings(label).color),
                settings(label).level
            )
        );
        loggers.set(label, newLogger);
        return newLogger;
    }
}

function makeLog(logLevel: string) {
    return (label: string, formatString: string, ...vars: any[]) => {
        getLogger(label.toUpperCase()).log(logLevel, formatString, ...vars);
    };
}

export default {
    error: makeLog("error"),
    warn: makeLog("warn"),
    info: makeLog("info"),
    http: makeLog("http"),
    verbose: makeLog("verbose"),
    debug: makeLog("debug"),
    silly: makeLog("silly"),
};
