const mockPlay = jest.fn();
jest.mock("@discordjs/voice", () => ({
    createAudioResource: jest.fn().mockReturnValue("AudioResource"),
}));

import Fact from "../../../engine/Fact";
import { getResults } from "../../../__tests__/helpers";
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
        const spy = jest.spyOn(Voice, "createAudioResource");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.lastCall![0]).toBe("foo.mp3");
    });
    test("play audio resource", () => {
        expect(mockPlay).toHaveBeenCalledTimes(1);
        expect(mockPlay.mock.lastCall[0]).toBe("AudioResource");
    });
});
