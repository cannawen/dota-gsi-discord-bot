import axios, { AxiosRequestConfig } from "axios";
import prism from "prism-media";
import Voice = require("@discordjs/voice");

function convertAudio(input: Buffer) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input);
        const ndata = new Int16Array(data.length / 2);
        for (let i = 0, j = 0; i < data.length; i += 4) {
            ndata[j++] = data[i];
            ndata[j++] = data[i + 1];
        }
        return Buffer.from(ndata);
    } catch (e) {
        console.log("convertAudio error: ", e);
        throw e;
    }
}

function getGoogleRequestOptions(): AxiosRequestConfig {
    let key = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
    let lang = "en-US";
    let profanityFilter = "0";

    return {
        url: `https://www.google.com/speech-api/v2/recognize?output=json&lang=${lang}&key=${key}&pFilter=${profanityFilter}`,
        headers: {
            "Content-Type": "audio/l16; rate=48000;",
        },
        method: "POST",
        transformResponse: [
            (data) => {
                const fixedData = data.replace('{"result":[]}', "");
                try {
                    return JSON.parse(fixedData);
                } catch (e) {
                    return { error: e };
                }
            },
        ],
    };
}

function transcribe(buffer: Buffer): Promise<string | void> {
    const requestOptions = getGoogleRequestOptions();
    requestOptions.data = buffer;
    return axios(requestOptions).then((response) => {
        if (response.data.error) {
            return;
        }
        return response.data.result[0].alternative[0].transcript;
    });
}

export function listenSpeechToText(
    receiver: Voice.VoiceReceiver,
    userId: string
): Promise<string | void> {
    return new Promise((res, rej) => {
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

        const bufferPieces: Buffer[] = [];
        decoder.on("data", (data) => {
            bufferPieces.push(data);
        });

        decoder.on("end", async () => {
            const totalBuffer = Buffer.concat(bufferPieces);
            const duration = totalBuffer.length / 48000 / 2;
            if (duration > 1.0 || duration < 19) {
                const transcript = transcribe(convertAudio(totalBuffer));
                res(transcript);
            }
        });
    });
}
