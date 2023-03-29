import express from "express";
import gsiParser from "./gsiParser";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("hello :3");
});

app.get("/coach/:studentId", (req, res) => {
    res.status(200).send(`html+js for ${req.params.studentId}`);
});

app.get("/coach/:studentId/poll", (req, res) => {
    res.status(200).send(`Playing audio for student ${req.params.studentId}`);
});

app.head("/gsi", (req, res) => {
    res.status(200).send();
});

app.post("/gsi", (req, res) => {
    gsiParser.feedState(req.body);
    res.status(200).send();
});

export default app;
