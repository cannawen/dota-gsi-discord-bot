import {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import analytics from "./analytics/analytics";
import discordClient from "./discord/discordClient";
import EffectConfig from "./effects/EffectConfig";
import effectConfig from "./effectConfigManager";
import engine from "./customEngine";
import express from "express";
import Fact from "./engine/Fact";
import fs from "fs";
import gsi from "node-gsi";
import GsiData from "./gsi/GsiData";
import gsiParser from "./gsiParser";
import helper from "./assistants/helpers/time";
import log from "./log";
import path from "path";
import persistence from "./persistence";
import { Status } from "./assistants/helpers/roshan";
import topicManager from "./engine/topicManager";
import topics from "./topics";
import Topic from "./engine/Topic";

const defaultConfigInfo = Object.fromEntries(
    effectConfig.defaultConfigInfo.map((configInfo) => [
        configInfo.ruleIndentifier,
        configInfo,
    ])
);

const app = express();

app.set("strict routing", true);
app.set("x-powered-by", false);

const router = express.Router({ strict: true });

router.use(express.json({ limit: "50mb" }));

router.use(
    "/resources/audio",
    express.static(path.join(__dirname, "../resources/audio"))
);

router.post("/debug_save-state", (req, res) => {
    const stateObj = Array.from(engine.getSessions().entries()).reduce(
        (memo: { [key: string]: unknown }, [studentId, db]) => {
            memo[studentId] = factsToPlainObject(
                db
                    .debug_getAllFacts()
                    .filter(
                        (fact) =>
                            fact.topic.label !== "discordSubscriptionTopic"
                    )
            );
            return memo;
        },
        {}
    );
    console.log(stateObj);
    persistence.debug_saveAllState(JSON.stringify(stateObj));
    res.status(200).send();
});

router.post("/coach/:studentId/debug_playPublicAudio", (req, res) => {
    engine.setFact(
        req.params.studentId,
        new Fact(topics.playPublicAudio, "resources/audio/jeopardy.mp3")
    );
    res.status(200).send();
});

router.post("/coach/:studentId/debug_playPrivateAudio", (req, res) => {
    engine.setFact(
        req.params.studentId,
        new Fact(topics.playPrivateAudio, "resources/audio/jeopardy.mp3")
    );
    res.status(200).send();
});

router.get("/instructions", (req, res) => {
    res.status(200).send(
        fs
            .readFileSync(
                path.join(__dirname, "../resources/instructions.html"),
                "utf8"
            )
            .replace(
                /DISCORD_APPLICATION_ID/g,
                process.env.DISCORD_APPLICATION_ID || ""
            )
    );
});

router.get("/coach/:studentId/", (req, res) => {
    res.status(200).sendFile(
        path.join(__dirname, "../resources/studentPage.html")
    );
});

router.post("/coach/:studentId/start", (req, res) => {
    const studentId = req.params.studentId;
    const existingSession = engine.getSession(studentId);
    if (existingSession) {
        engine.setFact(
            studentId,
            new Fact(topics.privateAudioQueue, undefined)
        );
    } else {
        engine.startCoachingSession(studentId);
    }
    res.status(200).send();
});

router.post("/coach/:studentId/stop", (req, res) => {
    engine.deleteSession(req.params.studentId);
    res.status(200).send();
});

router.get("/coach/:studentId/discord-audio-enabled", (req, res) => {
    res.status(200).json(
        engine.getFactValue(req.params.studentId, topics.discordAudioEnabled) ||
            false
    );
});

router.get("/coach/:studentId/config/get", (req, res) => {
    res.status(200).json(
        topicManager
            .getConfigTopics()
            .map((topic) => [
                defaultConfigInfo[topic.label].ruleIndentifier,
                defaultConfigInfo[topic.label].ruleName,
                engine.getFactValue(req.params.studentId, topic),
                defaultConfigInfo[topic.label].description,
            ])
    );
});

router.post("/coach/:studentId/config/:topic/:effect", (req, res) => {
    engine.setFact(
        req.params.studentId,
        new Fact<EffectConfig>(
            topicManager.findTopic(req.params.topic),
            effectConfig.effectFromString(req.params.effect)
        )
    );
    res.status(200).send();
});

router.post("/coach/:studentId/config/reset", (req, res) => {
    effectConfig
        .defaultConfigFacts()
        .map((fact) => engine.setFact(req.params.studentId, fact));
    res.status(200).send();
});

router.post("/coach/:studentId/config/PRIVATE", (req, res) => {
    topicManager.getConfigTopics().forEach((topic) => {
        const config = engine.getFactValue(req.params.studentId, topic);
        if (
            config === EffectConfig.PUBLIC ||
            config === EffectConfig.PUBLIC_INTERRUPTING
        ) {
            engine.setFact(
                req.params.studentId,
                new Fact(topic, EffectConfig.PRIVATE)
            );
        }
    });
    res.status(200).send();
});

function getNextAudio(studentId: string) {
    const queue = engine.getFactValue(studentId, topics.privateAudioQueue);
    if (queue && queue.length > 0) {
        const newQueue = [...queue];
        const nextFile = newQueue.splice(0, 1)[0];
        engine.setFact(studentId, new Fact(topics.privateAudioQueue, newQueue));
        return nextFile;
    }
}

router.get("/coach/:studentId/poll/audio", (req, res) => {
    const studentId = req.params.studentId;
    const nextAudio = getNextAudio(studentId);
    if (nextAudio) {
        const time = engine.getFactValue(studentId, topics.time) || 0;
        log.info(
            "effect",
            "%s - Playing private audio %s for %s",
            helper.secondsToMinuteString(time),
            nextAudio.magenta,
            studentId.substring(0, 10)
        );
        analytics.trackAudio(studentId, time, nextAudio, false);
    }
    res.status(200).json({ nextAudio: nextAudio });
});

// TODO rename to updatedConfig
function updateFrontend(studentId: string) {
    const updated = engine.getFactValue(studentId, topics.updateFrontend);
    if (updated) {
        engine.setFact(studentId, new Fact(topics.updateFrontend, undefined));
    }
    return updated;
}

router.get("/coach/:studentId/poll/config", (req, res) => {
    const studentId = req.params.studentId;
    res.status(200).json({ updateFrontend: updateFrontend(studentId) });
});

function roshNumbers(studentId: string) {
    return [
        topics.roshanAegisExpiryTime,
        topics.roshanMaybeAliveTime,
        topics.roshanAliveTime,
    ]
        .map((topic) => engine.getFactValue(studentId, topic))
        .map((time) => helper.secondsToMinuteString(time!))
        .join(" - ");
}

function countdownToTime(studentId: string, roshTimeTopic: Topic<number>) {
    const currentTime = engine.getFactValue(studentId, topics.time)!;
    const spawnTime = engine.getFactValue(studentId, roshTimeTopic)!;
    return helper.secondsToMinuteString(spawnTime - currentTime);
}

function roshanMessage(studentId: string) {
    const status = engine.getFactValue(studentId, topics.roshanStatus);
    switch (status) {
        case Status.NOT_IN_A_GAME:
            return "Not in a game";
        case Status.ALIVE:
            return "Alive";
        case Status.MAYBE_ALIVE:
            return `${engine.getFactValue(
                studentId,
                topics.roshanPercentChanceAlive
            )}% alive    ${roshNumbers(studentId)} (${countdownToTime(
                studentId,
                topics.roshanAliveTime
            )} until maximum spawn)`;
        case Status.DEAD:
            return `Dead     ${roshNumbers(studentId)} (${countdownToTime(
                studentId,
                topics.roshanMaybeAliveTime
            )} until mimimum spawn)`;
        default:
            return "Unknown";
    }
}

router.get("/coach/:studentId/poll/roshan", (req, res) => {
    const studentId = req.params.studentId;
    res.status(200).json({
        roshanStatus: roshanMessage(studentId),
    });
});

router.post("/coach/:studentId/stop-audio", (req, res) => {
    engine.setFact(req.params.studentId, new Fact(topics.stopAudio, true));
    engine.setFact(
        req.params.studentId,
        new Fact(topics.privateAudioQueue, undefined)
    );
    engine.setFact(
        req.params.studentId,
        new Fact(topics.publicAudioQueue, undefined)
    );
    res.status(200).send();
});

router.post("/coach/:studentId/skywrath", (req, res) => {
    engine.setFact(
        req.params.studentId,
        new Fact(
            topics.playInterruptingAudioFile,
            "resources/audio/skywrath.mpeg"
        )
    );
    res.status(200).send();
});

router.head("/gsi", (req, res) => {
    res.status(200).send();
});

router.post("/gsi", (req, res) => {
    gsiParser.feedState(req.body);
    res.status(200).send();
});

// GSI CODE

function parseStudentIdFromAuth(auth: string) {
    return auth.substring(0, 64);
}

function parseGsiFileVersionFromAuth(auth: string) {
    if (auth.length === 64) {
        return undefined;
    } else {
        return auth.substring(65, undefined);
    }
}

function handleCoaching(
    studentId: string,
    auth: string,
    gsiData: GsiData,
    live: boolean
) {
    const gsiVersion = parseGsiFileVersionFromAuth(auth);
    engine.setFact(studentId, new Fact(topics.allData, gsiData));
    engine.setFact(studentId, new Fact(topics.gsiEventsFromLiveGame, live));
    engine.setFact(studentId, new Fact(topics.gsiVersion, gsiVersion));
    analytics.trackGsiVersion(studentId, gsiVersion);

    if (
        !engine.getFactValue(studentId, topics.discordGuildId) ||
        !engine.getFactValue(studentId, topics.discordGuildChannelId)
    ) {
        const userId = engine.getFactValue(studentId, topics.discordUserId);
        const autoconnectGuildId = engine.getFactValue(
            studentId,
            topics.discordAutoconnectGuild
        );
        const autoconnectEnabled = engine.getFactValue(
            studentId,
            topics.discordAutoconnectEnabled
        ) as boolean;

        if (autoconnectGuildId && userId && autoconnectEnabled) {
            const channelId = discordClient.findChannelUserIsIn(
                autoconnectGuildId,
                userId
            );
            if (channelId) {
                engine.setFact(
                    studentId,
                    new Fact(topics.discordGuildId, autoconnectGuildId)
                );
                engine.setFact(
                    studentId,
                    new Fact(topics.discordGuildChannelId, channelId)
                );
            }
        }
    }
}

function handleNotCoaching(studentId: string) {
    try {
        const savedDb = persistence.readStudentData(studentId);
        if (savedDb) {
            const facts = plainObjectToFacts(JSON.parse(savedDb));

            const userId = facts.find(
                (f) => f.topic.label === topics.discordUserId.label
            )?.value as string | undefined;
            const autoconnectGuildId = facts.find(
                (f) => f.topic.label === topics.discordAutoconnectGuild.label
            )?.value as string | undefined;
            const autoconnectEnabled =
                facts.find(
                    (f) =>
                        f.topic.label === topics.discordAutoconnectEnabled.label
                )?.value !== false;

            if (autoconnectGuildId && userId && autoconnectEnabled) {
                const channelId = discordClient.findChannelUserIsIn(
                    autoconnectGuildId,
                    userId
                );
                if (channelId) {
                    engine.startCoachingSession(
                        studentId,
                        autoconnectGuildId,
                        channelId
                    );
                }
            }
        }
    } catch (e) {}
}

function handleOnGsi(
    studentId: string,
    auth: string,
    gsiData: GsiData,
    live: boolean
) {
    if (engine.isCoaching(studentId)) {
        handleCoaching(studentId, auth, gsiData, live);
    } else {
        handleNotCoaching(studentId);
    }
}

gsiParser.events.on(gsi.Dota2Event.Dota2State, (data: gsi.IDota2StateEvent) => {
    if (!data.auth) return;

    const studentId = parseStudentIdFromAuth(data.auth);
    handleOnGsi(
        studentId,
        data.auth,
        new GsiData({
            buildings: data.state.buildings,
            events: data.state.events,
            hero: data.state.hero,
            items: data.state.items,
            map: data.state.map,
            minimap: data.state.minimap,
            player: data.state.player,
            provider: data.state.provider,
        }),
        true
    );
});

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
// needs to be 6 for mitmproxy die-respawn-dig_canna to run properly
const playerId = 0;
gsiParser.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (data: gsi.IDota2ObserverStateEvent) => {
        if (!data.auth) return;

        const studentId = parseStudentIdFromAuth(data.auth);
        handleOnGsi(
            studentId,
            data.auth,
            new GsiData({
                buildings: data.state.buildings,
                events: data.state.events,
                hero: data.state.hero?.at(playerId) || null,
                items: data.state.items?.at(playerId) || null,
                map: data.state.map,
                minimap: data.state.minimap,
                player: data.state.player?.at(playerId) || null,
                provider: data.state.provider,
            }),
            false
        );
    }
);

app.use("/", router);

export default app;
