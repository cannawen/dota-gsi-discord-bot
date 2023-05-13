import {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import cron from "node-cron";
import discordClient from "./discord/discordClient";
import dotenv = require("dotenv");
import engine from "./customEngine";
import fs from "fs";
import http from "http";
import log from "./log";
import path = require("path");
import persistence from "./persistence";
import { registerAllTopics } from "./topics";
import Rule from "./engine/Rule";
import server from "./server";

dotenv.config();

// DEBUGGING MaxListenersExceededWarning

process.on("warning", (e) => console.warn(e.stack));

// RULE REGISTRATION CODE

function registerRulesInDirectory(directory: string) {
    const dirPath = path.join(__dirname, directory);
    fs.readdirSync(dirPath)
        // .js and because it gets transpiled in /build directory
        // .ts and because during testing, it stays in the /src directory
        // TODO Kinda sketch that we need the || for tests only ...
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .map((file) => path.join(dirPath, file))
        // eslint-disable-next-line global-require
        .map((filePath) => require(filePath))
        // register modules that return a `Rule` or array of `Rule`s
        .forEach((module) => {
            const rulesArray = Array.isArray(module.default)
                ? module.default
                : [module.default];
            rulesArray
                .filter((m: unknown) => m instanceof Rule)
                .forEach((rule: Rule) => engine.register(rule));
        });
}

export function registerEverything() {
    registerRulesInDirectory("assistants");
    registerRulesInDirectory("discord/rules");
    registerRulesInDirectory("effects");
    registerRulesInDirectory("gsi");

    registerAllTopics();
}

registerEverything();

// SERVER CODE

const port = process.env.PORT;
const host = process.env.HOST;
let httpServer: http.Server;

if (port && host) {
    httpServer = server.listen(Number(port), host, () => {
        log.info("app", "Starting server on %s", `http://${host}:${port}`);
    });
} else {
    log.error(
        "app",
        "Unable to start GSI server with port %s and host %s. Check your environment variables",
        port,
        host
    );
}

// SESSION CLEANUP CODE
cron.schedule("*/30 * * * *", () => {
    log.debug("app", "Cleaning up sessions with no recent activity");
    engine.deleteOldSessions();
});

// STARTUP CODE

discordClient.start().then(() => {
    const dataString = persistence.readRestartData() || "{}";
    const data = JSON.parse(dataString) as {
        [key: string]: { [key: string]: unknown };
    };
    try {
        Object.entries(data).forEach(([studentId, studentData]) => {
            engine.startCoachingSession(
                studentId,
                studentData["discordGuildId"] as string,
                studentData["discordGuildChannelId"] as string
            );
            plainObjectToFacts(studentData).map((fact) =>
                engine.setFact(studentId, fact)
            );
        });
    } catch (error) {
        persistence.deleteRestartData();
    }
});

// SHUTDOWN CODE

function storePersistentFactsAcrossRestarts() {
    const allData: { [key: string]: { [key: string]: unknown } } = {};
    engine.getSessions().forEach((db, studentId) => {
        allData[studentId] = factsToPlainObject(
            db.getPersistentFactsAcrossRestarts()
        );
    });
    persistence.saveRestartData(JSON.stringify(allData));
}

let shuttingDown = false;

function handleShutdown() {
    log.info("app", "Shutdown signal received");
    setTimeout(() => {
        log.error("app", "End handling shutdown UNGRACEFULLY".red);
        process.exit(0);
    }, 5000);

    if (!shuttingDown) {
        log.info("app", "Start handling shutdown");
        shuttingDown = true;
        storePersistentFactsAcrossRestarts();
        Array.from(engine.getSessions().keys()).forEach((studentId) => {
            engine.deleteSession(studentId);
        });
        if (httpServer) {
            httpServer.close((error) => {
                if (error) {
                    log.error(
                        "app",
                        "End handling shutdown UNGRACEFULLY %s",
                        error
                    );
                } else {
                    log.info("app", "End handling shutdown gracefully");
                }
                process.exit(0);
            });
        } else {
            log.info("app", "End handling shutdown gracefully");
            process.exit(0);
        }
    }
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
