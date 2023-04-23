const mockPlay = jest.fn();
jest.mock("@discordjs/voice");
jest.mock("../../../log");

import Fact from "../../../engine/Fact";
import rule from "../playAudioQueue";
import Voice from "@discordjs/voice";

describe("playAudioQueue", () => {
    let result: Fact<unknown>;
    beforeEach(() => {
        result = getResults(rule, {
            discordReadyToPlayAudio: true,
            publicAudioQueue: ["foo.mp3", "bar.mp3"],
            discordSubscriptionTopic: {
                player: {
                    play: mockPlay,
                },
            },
        }) as Fact<unknown>;
    });
    test("plays first audio file", () => {
        expect(result).toContainFact("publicAudioQueue", ["bar.mp3"]);
    });
    test("create audio resource", () => {
        expect(Voice.createAudioResource).toHaveBeenCalledWith("foo.mp3");
    });
    test("play audio resource", () => {
        expect(mockPlay).toHaveBeenCalledWith("AudioResource");
    });
});
