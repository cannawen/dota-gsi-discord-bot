/* eslint-disable sort-keys */
import dotenv = require("dotenv");
import fs from "fs";
import path = require("path");
import log from "./log";
dotenv.config();

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
    fs.unlinkSync(restartDataFilePath());
}

function saveRestartData(data: string) {
    try {
        log.info("app", "Saving data %s", data);
        fs.writeFileSync(restartDataFilePath(), data);
    } catch (error) {
        deleteRestartData();
        log.error("app", "Unable to write restart data %e", error);
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
        log.error("app", "Unable to read restart data %e", error);
    }
}

function deleteStudentData(studentId: string) {
    fs.unlinkSync(studentDataFilePath(studentId));
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
        log.error("app", "Unable to write student data %e", error);
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
        log.error("app", "Unable to read student data %e", error);
    }
}

export default {
    deleteRestartData,
    saveRestartData,
    readRestartData,

    deleteStudentData,
    saveStudentData,
    readStudentData,
};
