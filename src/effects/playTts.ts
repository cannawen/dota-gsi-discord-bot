import axios from "axios";
import engine from "../customEngine";
import { Fact } from "../Engine";
import fs = require("fs");
import log from "../log";
import path = require("path");
import topic from "../topic";

const TTS_DIRECTORY = "audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
    fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
    return path.join(TTS_DIRECTORY, `${ttsString}.mp3`);
}

function createTtsFile(ttsString: string) {
    if (fs.existsSync(ttsPath(ttsString))) {
        log.verbose("effect", "Found cached TTS %s", ttsString);
        return new Fact(topic.playAudioFile, ttsPath(ttsString));
    } else {
        log.verbose("effect", "Processing TTS string '%s'", ttsString);
        const encodedAudio = encodeURIComponent(ttsString);
        return axios({
            method: "get",
            responseType: "stream",
            url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
        })
            .then(
                (response) =>
                    new Promise<Fact<string>>((resolve, reject) => {
                        response.data
                            .pipe(fs.createWriteStream(ttsPath(ttsString)))
                            .on("close", () => {
                                log.verbose(
                                    "effect",
                                    "Finished writing TTS '%s' to file",
                                    ttsString
                                );
                                resolve(
                                    new Fact(
                                        topic.playAudioFile,
                                        ttsPath(ttsString)
                                    )
                                );
                            });
                    })
            )
            .catch((error) => {
                log.error(
                    "effect",
                    "Unable to TTS %s with error message %s",
                    ttsString,
                    error.message
                );
            });
    }
}

engine.register("effect/playTts", [topic.playTts], (get) => [
    new Fact(topic.playTts, undefined),
    createTtsFile(get(topic.playTts)!),
]);
