jest.mock("../../log");
jest.mock("@discordjs/voice");
const mockPlay = jest.fn();

import rule from "../playInterruptingAudio";
import Voice from "@discordjs/voice";

describe("playInterruptingAudio", () => {
    describe("discord audio enabled", () => {
        let results: any;
        beforeEach(() => {
            results = getResults(rule, {
                playInterruptingAudioFile: "foo.mp3",
                discordAudioEnabled: true,
                discordSubscriptionTopic: {
                    player: {
                        play: mockPlay,
                    },
                },
            }) as any;
        });
        test("reset state", () => {
            expect(results).not.toContainTopic("playInterruptingAudioFile");
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
            expect(results).not.toContainTopic("playInterruptingAudioFile");
        });
    });
});
