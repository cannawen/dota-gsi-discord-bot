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
    return {
        url: `https://www.google.com/speech-api/v2/recognize?output=json`,
        params: {
            lang: "en-US",
            key: "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw",
            pFilter: "0",
        },
        headers: {
            "Content-Type": "audio/l16; rate=48000;",
        },
        method: "POST",
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

// TODO should we move to the async format? Is this easier to understand?
// async function transcribe(buffer: Buffer) {
//     const requestOptions = getGoogleRequestOptions();
//     requestOptions.data = buffer;
//     const response = await axios(requestOptions);
//     if (response.data) {
//         return response.data.result[0].alternative[0].transcript;
//     } else {
//         return undefined;
//     }
// }

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

        const bufferPieces: Buffer[] = [];
        decoder.on("data", (data) => {
            bufferPieces.push(data);
        });

        decoder.on("end", async () => {
            const totalBuffer = Buffer.concat(bufferPieces);
            const duration = totalBuffer.length / 48000 / 2;
            if (duration > 1.0 || duration < 19) {
                resolve(transcribe(convertAudio(totalBuffer)));
            }
        });
    });
}
