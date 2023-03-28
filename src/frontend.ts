import express from "express";
import log from "./log";

const app = express();
const port = process.env.EXPRESS_PORT;
if (port) {
    app.get("/coach/:studentId", (req, res) => {
        const reqParams = req.params;
        res.status(200).send(
            `Playing audio for student ${reqParams.studentId}`
        );
    });
    app.listen(port, () => {
        log.info(
            "frontend",
            "Listening to requests on %s",
            `http://localhost:${port}`
        );
    });
} else {
    log.error(
        "frontend",
        "Unable to find environment variable %s.",
        "EXPRESS_PORT"
    );
}
