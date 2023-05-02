import EffectConfig from "./effects/EffectConfig";
import effectConfig from "./effectConfigManager";
import engine from "./customEngine";
import express from "express";
import Fact from "./engine/Fact";
import { factsToPlainObject } from "./engine/PersistentFactStore";
import fs from "fs";
import gsiParser from "./gsiParser";
import helper from "./assistants/helpers/timeFormatting";
import log from "./log";
import path from "path";
import persistence from "./persistence";
import topicManager from "./engine/topicManager";
import topics from "./topics";

const descriptions = assistantDescriptions();

function assistantDescriptions() {
    const dirPath = path.join(__dirname, "assistants");
    return (
        fs
            .readdirSync(dirPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(dirPath, file))
            // eslint-disable-next-line global-require
            .map((filePath) => require(filePath))
            .filter((module) => module.configTopic)
            .reduce((memo: { [key: string]: string }, module) => {
                memo[module.configTopic.label] = module.assistantDescription;
                return memo;
            }, {})
    );
}

const app = express();

app.set("strict routing", true);
app.set("x-powered-by", false);

const router = express.Router({ strict: true });

router.use(express.json());

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
    res.status(200).sendFile(
        path.join(__dirname, "../resources/instructions.html")
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
                topic.label,
                engine.getFactValue(req.params.studentId, topic),
                descriptions[topic.label],
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
        .defaultConfigs()
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

function updateFrontend(studentId: string) {
    const updated = engine.getFactValue(studentId, topics.updateFrontend);
    if (updated) {
        engine.setFact(studentId, new Fact(topics.updateFrontend, undefined));
    }
    return updated;
}

router.get("/coach/:studentId/poll", (req, res) => {
    // We can probably combine this map instead of doing one or the other
    const studentId = req.params.studentId;
    const nextAudio = getNextAudio(studentId);
    if (nextAudio) {
        log.info(
            "effect",
            "%s - Playing private audio %s for %s",
            helper.secondsToTimeString(
                engine.getFactValue(studentId, topics.time) || 0
            ),
            nextAudio.magenta,
            studentId.substring(0, 10)
        );
        res.status(200).json({ nextAudio: nextAudio });
    } else if (updateFrontend(studentId)) {
        res.status(200).json({ updateFrontend: true });
    } else {
        res.status(200).json({ roshStatus: roshMessage(studentId) });
    }
});

function roshMessage(studentId: string) {
    const inGame = engine.getFactValue(studentId, topics.inGame);
    let message = "ALIVE";
    if (inGame) {
        const time = engine.getFactValue(studentId, topics.time)!;
        const maybeAlive = engine.getFactValue(
            studentId,
            topics.roshanMaybeAliveTime
        );
        const alive = engine.getFactValue(studentId, topics.roshanAliveTime);
        if (maybeAlive !== undefined && time < maybeAlive) {
            message = "DEAD";
        } else if (alive !== undefined && time < alive) {
            message = "MAYBE ALIVE";
        }
    } else {
        message = "NOT IN A GAME";
    }
    return message;
}

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

router.head("/gsi", (req, res) => {
    res.status(200).send();
});

router.post("/gsi", (req, res) => {
    gsiParser.feedState(req.body);
    res.status(200).send();
});

app.use("/", router);

export default app;
