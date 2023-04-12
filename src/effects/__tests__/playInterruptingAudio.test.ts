jest.mock("../../log");
const mockPlay = jest.fn();
const mockCreateAudioResource = jest.fn().mockReturnValue("AudioResource");
jest.mock("@discordjs/voice", () => ({
    createAudioResource: mockCreateAudioResource,
}));

import Fact from "../../engine/Fact";
import { getResults } from "../../__tests__/helpers";
import rule from "../playInterruptingAudio";

describe("playInterruptingAudio", () => {
    describe("discord audio enabled", () => {
        let results: Fact<unknown>;
        beforeEach(() => {
            results = getResults(rule, {
                playInterruptingAudioFile: "foo.mp3",
                discordAudioEnabled: true,
                discordSubscriptionTopic: {
                    player: {
                        play: mockPlay,
                    },
                },
            }) as Fact<unknown>;
        });
        test("reset state", () => {
            expect(results).toContainFact(
                "playInterruptingAudioFile",
                undefined
            );
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

    describe("discord audio disabled", () => {
        test("should reset state", () => {
            const results = getResults(rule, {
                playInterruptingAudioFile: "foo.mp3",
                discordAudioEnabled: false,
            });
            expect(results).toContainFact(
                "playInterruptingAudioFile",
                undefined
            );
        });
    });
});
