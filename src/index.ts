// TODO export a non-connected discord client, and only start it here
import "./discord/client";

import Config, { registerConfig } from "./configTopics";
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
        .forEach((topic) => registerConfig(topic.label, topic));
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

function handleShutdown() {
    log.info("app", "Shutdown signal received.");
    log.info("app", "Closing http server.");
    httpServer?.close(() => {
        log.info("app", "Http server closed.");
        process.exit(0);
    });
}

process.on("SIGTERM", () => {
    handleShutdown();
});

process.on("SIGINT", () => {
    handleShutdown();
});
