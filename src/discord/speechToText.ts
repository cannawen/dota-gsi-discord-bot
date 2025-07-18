/* eslint-disable sort-keys */
import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import path from "path";
import prism from "prism-media";
import stream from "stream";
import Voice = require("@discordjs/voice");

const STT_DIRECTORY = "resources/audio/stt-cache";
if (!fs.existsSync(STT_DIRECTORY)) {
    fs.mkdirSync(STT_DIRECTORY);
}

function sttPath(userId: string) {
    return path.join(STT_DIRECTORY, `${userId}.ogg`);
}

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

function transcribeNetworkCall(
    audioBuffer: Buffer
): Promise<string | undefined> {
    return axios(googleTranscribeRequest(audioBuffer)).then((response) => {
        if (response.data) {
            return response.data.result[0].alternative[0].transcript;
        } else {
            return undefined;
        }
    });
}

const activeStreams = new Map<string, Voice.AudioReceiveStream>();

function transcribe(
    receiver: Voice.VoiceReceiver,
    userId: string
): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        // Clean up any existing stream for this user
        const existingStream = activeStreams.get(userId);
        if (existingStream) {
            existingStream.destroy();
            activeStreams.delete(userId);
        }

        const source = receiver.subscribe(userId, {
            end: {
                behavior: Voice.EndBehaviorType.AfterSilence,
                duration: 300,
            },
        });
        
        // Track this stream
        activeStreams.set(userId, source);

        const timeout = setTimeout(() => {
            source.destroy(
                new Error(`${userId.substring(0, 10)} talking for too long`)
            );
        }, 5000);

        const decoder = new prism.opus.Decoder({
            channels: 2,
            frameSize: 960,
            rate: 48000,
        });
        const destination = fs.createWriteStream(sttPath(userId));

        // https://github.com/discordjs/voice-examples/blob/main/recorder/src/createListeningStream.ts
        stream.pipeline(source, decoder, destination, (err) => {
            destination.close();
            clearTimeout(timeout);
            
            // Clean up tracking
            activeStreams.delete(userId);
            
            if (err) {
                reject(err);
            } else {
                resolve(
                    transcribeNetworkCall(
                        convertAudioFromStereoToMono(
                            fs.readFileSync(sttPath(userId))
                        )
                    )
                );
            }
        });
    });
}

export default {
    transcribe,
};

/**
https://github.com/Rei-x/discord-speech-recognition

MIT License

Copyright (c) 2022 Bartosz Gotowski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
