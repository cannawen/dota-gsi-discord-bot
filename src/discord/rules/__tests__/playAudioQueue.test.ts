const mockPlay = jest.fn();
jest.mock("@discordjs/voice");
jest.mock("../../../log");

import rule from "../playAudioQueue";
import Voice from "@discordjs/voice";

describe("playAudioQueue", () => {
    let result: any;
    beforeEach(() => {
        result = getResults(rule, {
            discordReadyToPlayAudio: true,
            time: 0,
            publicAudioQueue: ["foo.mp3", "bar.mp3"],
            discordSubscriptionTopic: {
                player: {
                    play: mockPlay,
                },
            },
        }) as any;
    });
    test("plays both audio files", () => {
        expect(result).toContainFact("publicAudioQueue", []);
    });
    test("create audio resource", () => {
        expect(Voice.createAudioResource).toHaveBeenCalledWith("foo.mp3");
        expect(Voice.createAudioResource).toHaveBeenCalledWith("bar.mp3");
    });
    test("play audio resource", () => {
        expect(mockPlay).toHaveBeenCalledWith("AudioResource");
        expect(mockPlay).toHaveBeenCalledTimes(2);
    });
});
