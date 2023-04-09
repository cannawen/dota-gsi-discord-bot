import engine from "./customEngine";
import express from "express";
import gsiParser from "./gsiParser";
import log from "./log";
import path from "path";
import topicManager from "./engine/topicManager";

const app = express();

app.set("strict routing", true);
app.set("x-powered-by", false);

const router = express.Router({ strict: true });

router.use(express.json());

router.use(
    "/resources/audio",
    express.static(path.join(__dirname, "../resources/audio"))
);

router.post("/saveState", (req, res) => {
    engine.saveState();
    res.status(200).send();
});

router.post("/readState", (req, res) => {
    engine.readState();
    res.status(200).send();
});

router.post("/kill", (req, res) => {
    process.kill(process.pid, "SIGTERM");
    res.status(200).send();
});

router.get("/", (req, res) => {
    res.status(200).send("hello :3");
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

router.get("/coach/:studentId/discordAudioEnabled", (req, res) => {
    res.status(200).json(engine.isDiscordEnabled(req.params.studentId));
});

router.get("/coach/:studentId/config", (req, res) => {
    res.status(200).json(engine.getEffectConfigs(req.params.studentId));
});

router.post("/coach/:studentId/config/:rule/:effect", (req, res) => {
    const studentId = req.params.studentId;
    const rule = req.params.rule;
    const effect = req.params.effect;
    engine.changeConfig(studentId, rule, effect);
    res.status(200).send();
});

router.get("/coach/:studentId/poll", (req, res) => {
    const id = req.params.studentId;
    const nextAudio = engine.handleNextPrivateAudio(id);
    const configUpdated = engine.pollConfigUpdateAndReset(id);
    if (nextAudio) {
        log.info("effect", "Playing private audio %s", nextAudio.magenta);
        res.status(200).json({ nextAudio: nextAudio });
    } else if (configUpdated) {
        res.status(200).json({ configUpdated: true });
    } else {
        res.status(200).send([null]);
    }
});

router.post("/coach/:studentId/stop-audio", (req, res) => {
    engine.stopAudio(req.params.studentId);
    res.status(200).send();
});

router.post("/coach/:studentId/reset-config", (req, res) => {
    engine.resetConfig(req.params.studentId);
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
