/* eslint-disable sort-keys */
import axios, { AxiosRequestConfig } from "axios";
import prism from "prism-media";
import Voice = require("@discordjs/voice");

// This file is a mashup of:
// https://github.com/ShadowLp174/discord-stt
// https://github.com/Rei-x/discord-speech-recognition

function convertAudioFromStereoToMono(input: Buffer) {
    const stereoData = new Int16Array(input);
    const monoData = stereoData.filter((_, idx) => idx % 2);
    return Buffer.from(monoData);
}

function getGoogleRequestOptions(): AxiosRequestConfig {
    // Docs:
    // https://github.com/gillesdemey/google-speech-v2
    // https://github.com/Uberi/speech_recognition/blob/c89856088ad81d81d38be314e3db50905481c5fe/speech_recognition/__init__.py#L850
    return {
        url: `https://www.google.com/speech-api/v2/recognize?output=json`,
        method: "POST",
        params: {
            // Uses generic Google API key for free speech to text
            key: "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw",
            lang: "en-US",
            pFilter: "0",
        },
        headers: {
            "Content-Type": "audio/l16; rate=48000;",
        },
        transformResponse: [
            (data) => {
                // Google randomly sends an extra `{"result":[]}\n`
                // Before our actual results. Filter it out here
                const fixedData = data.replace('{"result":[]}\n', "");
                if (fixedData === "") {
                    return undefined;
                } else {
                    return JSON.parse(fixedData);
                }
            },
        ],
    };
}

function transcribe(buffer: Buffer): Promise<string | void> {
    const requestOptions = getGoogleRequestOptions();
    requestOptions.data = buffer;
    return axios(requestOptions).then((response) => {
        if (response.data) {
            return response.data.result[0].alternative[0].transcript;
        } else {
            return undefined;
        }
    });
}

export function listenSpeechToText(
    receiver: Voice.VoiceReceiver,
    userId: string
): Promise<string | void> {
    return new Promise((resolve) => {
        const stream = receiver.subscribe(userId, {
            end: {
                behavior: Voice.EndBehaviorType.AfterSilence,
                duration: 300,
            },
        });

        const decoder = new prism.opus.Decoder({
            channels: 2,
            frameSize: 960,
            rate: 48000,
        });
        stream.pipe(decoder);

        const bufferArray: Buffer[] = [];
        decoder.on("data", (data) => {
            bufferArray.push(data);
        });

        decoder.on("end", async () => {
            const buffer = Buffer.concat(bufferArray);
            // const duration = buffer.length / 48000 / 2;
            // if (duration > 1.0 || duration < 19) {
            resolve(transcribe(convertAudioFromStereoToMono(buffer)));
            // }
        });
    });
}
