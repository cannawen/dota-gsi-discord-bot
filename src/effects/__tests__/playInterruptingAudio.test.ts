jest.mock("../../log");
jest.mock("@discordjs/voice");
const mockPlay = jest.fn();

import Fact from "../../engine/Fact";
import rule from "../playInterruptingAudio";
import Voice from "@discordjs/voice";

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
            expect(Voice.createAudioResource).toHaveBeenCalledWith("foo.mp3");
        });
        test("play audio resource", () => {
            expect(mockPlay).toHaveBeenCalledWith("AudioResource");
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
