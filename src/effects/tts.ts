import axios from "axios";
import fs = require("fs");
import log from "../log";
import OpenAI from "openai";
import path = require("path");

let openAi: OpenAI | undefined;

try {
    openAi = new OpenAI({ apiKey: process.env.CHATGPT_SECRET_KEY });
} catch (e) {}

const TTS_DIRECTORY = "resources/audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
    fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
    return path.join(TTS_DIRECTORY, `${ttsString}.mp3`);
}

async function openAiCreate(ttsString: string): Promise<void> {
    // this cast to any is a bit suspect; but I think it may be the library's fault?
    const mp3: any = await openAi?.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: ttsString,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(path.resolve(ttsPath(ttsString)), buffer);
}

function googleCreate(ttsString: string): Promise<void> {
    const encodedAudio = encodeURIComponent(ttsString);
    return axios({
        method: "get",
        responseType: "stream",
        url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
    }).then((response) =>
        response.data.pipe(fs.createWriteStream(ttsPath(ttsString)))
    );
}

function create(ttsString: string): Promise<void> {
    log.verbose("effect", "Processing TTS string '%s'", ttsString);

    return (openAi ? openAiCreate(ttsString).catch((e) => googleCreate(ttsString)) : googleCreate(ttsString))
        .then(() => {
            log.verbose(
                "effect",
                "Finished writing TTS '%s' to file",
                ttsString
            );
        })
        .catch((error) => {
            log.error(
                "effect",
                "Unable to TTS %s with error message %s",
                ttsString,
                error.message
            );
        });
}

export default {
    create,
    path: ttsPath,
};
