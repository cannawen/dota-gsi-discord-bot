import Fact from "../../engine/Fact";
import { getResults } from "../../__tests__/helpers";
import rule from "../playInterruptingAudio";

jest.mock("../../log");
const mockPlay = jest.fn();
jest.mock("@discordjs/voice", () => ({
    createAudioResource: jest.fn().mockReturnValue("AudioResource"),
}));

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
