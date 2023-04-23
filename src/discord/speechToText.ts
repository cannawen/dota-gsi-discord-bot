/* eslint-disable sort-keys */
import axios, { AxiosRequestConfig } from "axios";
import prism from "prism-media";
import Voice = require("@discordjs/voice");

// This file is a mashup of:
// https://github.com/ShadowLp174/discord-stt
// https://github.com/Rei-x/discord-speech-recognition

function convertAudioFromStereoToMono(stereoAudioBuffer: Buffer) {
    const stereoBuffer = new Int16Array(stereoAudioBuffer);
    const monoBuffer = stereoBuffer.filter((_, idx) => idx % 2);
    return Buffer.from(monoBuffer);
}

function googleTranscribeRequest(requestData: Buffer): AxiosRequestConfig {
    // Docs:
    // https://github.com/gillesdemey/google-speech-v2
    // https://github.com/Uberi/speech_recognition/blob/c89856088ad81d81d38be314e3db50905481c5fe/speech_recognition/__init__.py#L850
    return {
        url: `https://www.google.com/speech-api/v2/recognize?output=json`,
        method: "POST",
        data: requestData,
        params: {
            // Uses generic Google API key for free speech to text
            key: "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw",
            lang: "en-US",
            // profanity filter is off
            pFilter: "0",
        },
        headers: {
            "Content-Type": "audio/l16; rate=48000;",
        },
        transformResponse: [
            (responseData) => {
                // Google randomly sends an extra `{"result":[]}\n`
                // Before our actual results. Filter it out here
                const fixedData = responseData.replace('{"result":[]}\n', "");
                if (fixedData === "") {
                    return undefined;
                } else {
                    return JSON.parse(fixedData);
                }
            },
        ],
    };
}

function transcribeNetworkCall(audioBuffer: Buffer): Promise<string | void> {
    return axios(googleTranscribeRequest(audioBuffer)).then((response) => {
        if (response.data) {
            return response.data.result[0].alternative[0].transcript;
        } else {
            return undefined;
        }
    });
}

export function transcribe(
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

        const audioBufferArray: Buffer[] = [];
        decoder.on("data", (data) => {
            audioBufferArray.push(data);
        });

        decoder.on("end", async () => {
            const audioBuffer = Buffer.concat(audioBufferArray);
            resolve(
                transcribeNetworkCall(convertAudioFromStereoToMono(audioBuffer))
            );
        });
    });
}
