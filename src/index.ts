import "./discord/client";
import "./discord/startVoiceSubscription";
import "./discord/playAudioQueue";

import dotenv = require("dotenv");
import engine from "./customEngine";
import fs from "fs";
import gsi = require("node-gsi");
import log from "./log";
import path = require("path");
import Rule from "./engine/Rule";

dotenv.config();

function importAll(directory: string) {
    const dirPath = path.join(__dirname, directory);
    fs.readdirSync(dirPath)
        // .js and not .ts because it gets transpiled in /build directory
        .filter((file) => file.endsWith(".js"))
        .map((file) => path.join(dirPath, file))
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

importAll("assistants");
importAll("effects");
importAll("gsi");

const debug = process.env.GSI_DEBUG === "true";
const server = new gsi.Dota2GSIServer("/gsi", debug);

// TODO refactor time and gamestate to be under map and split up later
server.events.on(gsi.Dota2Event.Dota2State, (data: gsi.IDota2StateEvent) => {
    // Check to see if we care about this auth token before sending info to the engine
    // See if it matches topic.discordCoachMe and is not undefined
    engine.setGsi(data.auth, {
        events: data.state.events,
        gameState: data.state.map?.gameState,
        hero: data.state.hero,
        items: data.state.items,
        time: data.state.map?.clockTime,
    });
});

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
// needs to be 6 for mitmproxy die-respawn-dig-dig_canna to run properly
const playerId = 6;
server.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (data: gsi.IDota2ObserverStateEvent) => {
        engine.setGsi(data.auth, {
            events: data.state.events,
            gameState: data.state.map?.gameState,
            hero: data.state.hero?.at(playerId),
            items: data.state.items?.at(playerId),
            time: data.state.map?.clockTime,
        });
    }
);

// eslint-disable-next-line no-magic-numbers
const port = process.env.PORT;
const host = process.env.HOST;
if (port && host) {
    server.listen(Number(port), host);
    log.info("gsi", "Starting GSI server on port %s", port.magenta);
} else {
    log.error(
        "gsi",
        "Unable to start GSI server with port %s and host %s. Check your environment variables",
        port,
        host
    );
}
