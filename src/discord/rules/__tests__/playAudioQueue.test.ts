const mockPlay = jest.fn();
const mockCreateAudioResource = jest.fn().mockReturnValue("AudioResource");
jest.mock("@discordjs/voice", () => ({
    createAudioResource: mockCreateAudioResource,
}));

import Fact from "../../../engine/Fact";
import { getResults } from "../../../__tests__/helpers";
import rule from "../playAudioQueue";

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
        expect(mockCreateAudioResource).toHaveBeenCalledTimes(1);
        expect(mockCreateAudioResource.mock.lastCall[0]).toBe("foo.mp3");
    });
    test("play audio resource", () => {
        expect(mockPlay).toHaveBeenCalledTimes(1);
        expect(mockPlay.mock.lastCall[0]).toBe("AudioResource");
    });
});
