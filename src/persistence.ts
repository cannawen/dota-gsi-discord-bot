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
function saveData(allData: string) {
    if (dataPath) {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        fs.writeFileSync(dataPath, allData);
    }
}

function readData() {
    if (dataPath && fs.existsSync(dataPath)) {
        return fs.readFileSync(dataPath, "utf8");
    }
}

export default {
    saveData,
    readData,
};
