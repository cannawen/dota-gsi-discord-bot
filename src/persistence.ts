/* eslint-disable sort-keys */
import dotenv = require("dotenv");
import fs from "fs";
import path = require("path");
import log from "./log";
dotenv.config();

const dataPath = process.env.PERSISTENCE_DATA_PATH;

if (!dataPath) {
    log.warn(
        "app",
        "%s not set; continuing but data will not be restored between restarts",
        "PERSISTENCE_DATA_PATH".red
    );
}

function saveData(data: string) {
    if (dataPath) {
        log.info("app", "Saving data %s", data);
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        fs.writeFileSync(dataPath, data);
    }
}

function readData() {
    if (dataPath && fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, "utf8");
        fs.unlinkSync(dataPath);
        log.info("app", "Reading data %s", data);
        return data;
    }
}

export default {
    saveData,
    readData,
};
