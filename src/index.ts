import Config, { registerConfigRule } from "./configTopics";
import discordClient from "./discord/client";
import dotenv = require("dotenv");
import engine from "./customEngine";
import fs from "fs";
import gsi = require("node-gsi");
import gsiParser from "./gsiParser";
import http from "http";
import log from "./log";
import path = require("path");
import Rule from "./engine/Rule";
import server from "./server";
import Topic from "./engine/Topic";

dotenv.config();

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

function registerAssistantConfig() {
    const dirPath = path.join(__dirname, "assistants");
    fs.readdirSync(dirPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .map((file) => path.join(dirPath, file))
        // eslint-disable-next-line global-require
        .map((filePath) => require(filePath))
        .map((module) => module.configTopic as Topic<Config>)
        .forEach((topic) => registerConfigRule(topic.label, topic));
}

registerRulesInDirectory("assistants");
registerRulesInDirectory("discord/rules");
registerRulesInDirectory("effects");
registerRulesInDirectory("gsi");

registerAssistantConfig();

gsiParser.events.on(gsi.Dota2Event.Dota2State, (data: gsi.IDota2StateEvent) => {
    // Check to see if we care about this auth token before sending info to the engine
    // See if it matches topic.discordCoachMe and is not undefined
    engine.setGsi(data.auth, {
        events: data.state.events,
        hero: data.state.hero,
        items: data.state.items,
        map: data.state.map,
        player: data.state.player,
    });
});

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
// needs to be 6 for mitmproxy die-respawn-dig_canna to run properly
const playerId = 6;
gsiParser.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (data: gsi.IDota2ObserverStateEvent) => {
        engine.setGsi(data.auth, {
            events: data.state.events,
            hero: data.state.hero?.at(playerId) || null,
            items: data.state.items?.at(playerId) || null,
            map: data.state.map,
            player: data.state.player?.at(playerId) || null,
        });
    }
);

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

discordClient.start().then(() => {
    engine.handleStartup();
});

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
        httpServer?.close(() => {
            log.info("app", "Http server closed");
        });
        engine.handleShutdown().then(() => {
            log.info("app", "End handling shutdown gracefully");
            process.exit(0);
        });
    }
}

process.on("SIGINT", handleShutdown);
// process.on("SIGTERM", handleShutdown);
