/* eslint-disable sort-keys */
import dotenv = require("dotenv");
import fs from "fs";
import path = require("path");
import log from "./log";
dotenv.config();

const dataPath = process.env.PERSISTENCE_DATA_PATH!;

const RESTART_DATA_FILE_PATH = path.join(dataPath, "restartData.json");
const USER_DATA_DIRECTORY_PATH = path.join(dataPath, "user");

if (!fs.existsSync(USER_DATA_DIRECTORY_PATH)) {
    fs.mkdirSync(USER_DATA_DIRECTORY_PATH, {
        recursive: true,
    });
}

function saveRestartData(data: string) {
    log.info("app", "Saving data %s", data);
    fs.writeFileSync(RESTART_DATA_FILE_PATH, data);
}

function readRestartData() {
    if (fs.existsSync(RESTART_DATA_FILE_PATH)) {
        const data = fs.readFileSync(RESTART_DATA_FILE_PATH, "utf8");
        fs.unlinkSync(RESTART_DATA_FILE_PATH);
        log.info("app", "Reading data %s", data);
        return data;
    }
}

export default {
    saveRestartData,
    readRestartData,
};
