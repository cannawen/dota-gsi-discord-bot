import axios from "axios";
import Fact from "../engine/Fact";
import fs = require("fs");
import log from "../log";
import path = require("path");
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const TTS_DIRECTORY = "resources/audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
    fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
    return path.join(TTS_DIRECTORY, `${ttsString}.mp3`);
}

function createTtsFile(ttsString: string) {
    if (fs.existsSync(ttsPath(ttsString))) {
        log.verbose("effect", "Found cached TTS %s", ttsString);
        return new Fact(topics.effect.playAudioFile, ttsPath(ttsString));
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
                                        topics.effect.playAudioFile,
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

export default new Rule(
    rules.effect.playTts,
    [topics.effect.playTts],
    (get) => [
        new Fact(topics.effect.playTts, undefined),
        createTtsFile(get(topics.effect.playTts)!),
    ]
);
