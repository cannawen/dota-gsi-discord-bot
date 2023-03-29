import express from "express";
import gsiParser from "./gsiParser";
import path from "path";

const app = express();

app.use(express.json());

app.use(
    "/resources/audio",
    express.static(path.join(__dirname, "../resources/audio"))
);

app.get("/", (req, res) => {
    res.status(200).send("hello :3");
});

app.get("/coach/:studentId/", (req, res) => {
    res.status(200).sendFile(
        path.join(__dirname, "../resources/studentPage.html")
    );
});

app.get("/coach/:studentId/poll", (req, res) => {
    const id = req.params.studentId;

    res.status(200).json([
        Math.random() > 0.85 ? "resources/audio/rune-sound.mp3" : null,
    ]);
});

app.head("/gsi", (req, res) => {
    res.status(200).send();
});

app.post("/gsi", (req, res) => {
    gsiParser.feedState(req.body);
    res.status(200).send();
});

export default app;
