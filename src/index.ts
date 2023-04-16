import effectConfig, { EffectConfig } from "./effectConfigManager";
import {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import discordClient from "./discord/discordClient";
import dotenv = require("dotenv");
import engine from "./customEngine";
import Fact from "./engine/Fact";
import fs from "fs";
import gsi = require("node-gsi");
import GsiData from "./gsi/GsiData";
import gsiParser from "./gsiParser";
import http from "http";
import log from "./log";
import path = require("path");
import persistence from "./persistence";
import Rule from "./engine/Rule";
import server from "./server";
import Topic from "./engine/Topic";
import topics from "./topics";

dotenv.config();

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

function registerAssistantConfig() {
    const dirPath = path.join(__dirname, "assistants");
    fs.readdirSync(dirPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .map((file) => path.join(dirPath, file))
        // eslint-disable-next-line global-require
        .map((filePath) => require(filePath))
        .map((module) => module.configTopic as Topic<EffectConfig>)
        .forEach((topic) =>
            effectConfig.registerEffectConfigRule(topic.label, topic)
        );
}

export function registerEverything() {
    registerRulesInDirectory("assistants");
    registerRulesInDirectory("discord/rules");
    registerRulesInDirectory("effects");
    registerRulesInDirectory("gsi");

    registerAssistantConfig();
}

registerEverything();

// GSI CODE

gsiParser.events.on(gsi.Dota2Event.Dota2State, (data: gsi.IDota2StateEvent) => {
    // Check to see if we care about this auth token before sending info to the engine
    // See if it matches topic.discordCoachMe and is not undefined
    engine.setFact(
        data.auth,
        new Fact(
            topics.allData,
            new GsiData({
                events: data.state.events,
                hero: data.state.hero,
                items: data.state.items,
                map: data.state.map,
                player: data.state.player,
                provider: data.state.provider,
            })
        )
    );
});

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
// needs to be 6 for mitmproxy die-respawn-dig_canna to run properly
const playerId = 6;
gsiParser.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (data: gsi.IDota2ObserverStateEvent) => {
        engine.setFact(
            data.auth,
            new Fact(
                topics.allData,
                new GsiData({
                    events: data.state.events,
                    hero: data.state.hero?.at(playerId) || null,
                    items: data.state.items?.at(playerId) || null,
                    map: data.state.map,
                    player: data.state.player?.at(playerId) || null,
                    provider: data.state.provider,
                })
            )
        );
    }
);

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

// STARTUP CODE

discordClient.start().then(() => {
    const dataString = persistence.readRestartData() || "{}";
    const data = JSON.parse(dataString) as {
        [key: string]: { [key: string]: unknown };
    };
    try {
        Object.entries(data).forEach(([studentId, studentData]) => {
            engine.startCoachingSession(studentId);
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

function notifyStudentsOfRestart() {
    return new Promise<void>((resolve) => {
        let expectedReadyCount = 0;
        engine.getSessions().forEach((db, studentId) => {
            log.info("app", "Notify %s of shutdown", studentId);
            if (db.get(topics.discordAudioEnabled)) {
                expectedReadyCount++;
                engine.setFact(
                    studentId,
                    new Fact(
                        topics.playInterruptingAudioFile,
                        "resources/audio/restart.mp3"
                    )
                );
            }
        });
        if (expectedReadyCount === 0) {
            resolve();
        }
        let readyCount = 0;
        engine.register(
            new Rule(
                "wait for all audio to be done playing",
                [topics.discordReadyToPlayAudio],
                (get) => {
                    if (get(topics.discordReadyToPlayAudio)!) {
                        readyCount++;
                        log.info(
                            "app",
                            "Finished notifying %s of shutdown",
                            get(topics.studentId)
                        );
                    }
                    if (readyCount === expectedReadyCount) {
                        resolve();
                    }
                }
            )
        );
    });
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
        httpServer?.close();
        storePersistentFactsAcrossRestarts();
        notifyStudentsOfRestart().then(() => {
            Array.from(engine.getSessions().keys()).forEach((studentId) => {
                engine.deleteSession(studentId);
            });
            log.info("app", "End handling shutdown gracefully");
            process.exit(0);
        });
    }
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
