/* eslint-disable sort-keys */
import dotenv = require("dotenv");
import fs from "fs";
import path = require("path");
import log from "./log";
dotenv.config();

if (!fs.existsSync(process.env.PERSISTENCE_DATA_PATH || "")) {
    fs.mkdirSync(process.env.PERSISTENCE_DATA_PATH || "", { recursive: true });
}

// eslint-disable-next-line camelcase
function debug_saveAllState(state: string) {
    log.debug("rules", state);
    fs.writeFileSync(
        path.join(
            process.env.PERSISTENCE_DATA_PATH || "",
            "debug_saveAllState.json"
        ),
        state
    );
}

function restartDataFilePath() {
    return path.join(
        process.env.PERSISTENCE_DATA_PATH || "",
        "restartData.json"
    );
}

function studentDataDirectory() {
    return path.join(process.env.PERSISTENCE_DATA_PATH || "", "student");
}

function studentDataFilePath(studentId: string) {
    return path.join(studentDataDirectory(), `${studentId}.json`);
}

function deleteRestartData() {
    try {
        fs.unlinkSync(restartDataFilePath());
    } catch (_) {}
}

function saveRestartData(data: string) {
    try {
        log.info("app", "Saving data %s", data);
        fs.writeFileSync(restartDataFilePath(), data);
    } catch (error) {
        deleteRestartData();
        log.error("app", "Unable to write restart data %s", error);
    }
}

function readRestartData() {
    try {
        const filePath = restartDataFilePath();
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            fs.unlinkSync(filePath);
            log.info("app", "Reading data %s", data);
            return data;
        }
    } catch (error) {
        deleteRestartData();
        log.error("app", "Unable to read restart data %s", error);
    }
}

function deleteStudentData(studentId: string) {
    try {
        fs.unlinkSync(studentDataFilePath(studentId));
    } catch (_) {}
}

function saveStudentData(studentId: string, data: string) {
    try {
        if (!fs.existsSync(studentDataDirectory())) {
            fs.mkdirSync(studentDataDirectory(), {
                recursive: true,
            });
        }
        fs.writeFileSync(studentDataFilePath(studentId), data);
    } catch (error) {
        deleteStudentData(studentId);
        log.error("app", "Unable to write student data %s", error);
    }
}

function readStudentData(studentId: string) {
    try {
        const studentFile = studentDataFilePath(studentId);
        if (fs.existsSync(studentFile)) {
            return fs.readFileSync(studentFile, "utf8");
        }
    } catch (error) {
        deleteStudentData(studentId);
        log.error("app", "Unable to read student data %s", error);
    }
}

export default {
    deleteRestartData,
    saveRestartData,
    readRestartData,

    deleteStudentData,
    saveStudentData,
    readStudentData,

    debug_saveAllState,
};
