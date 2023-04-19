import Fact from "../../engine/Fact";
import { getResults } from "../../__tests__/helpers";
import rule from "../playPublicAudio";

describe("playAudio", () => {
    describe("discord audio enabled", () => {
        test("should create audio queue and reset state", () => {
            const results = getResults(rule, {
                playDiscordAudio: "foo.mp3",
                discordAudioEnabled: true,
            }) as Fact<string[]>[];

            expect(results).toContainTopic("publicAudioQueue");
            expect(results[0].value[0]).toContain("foo.mp3");

            expect(results).toContainFact("playDiscordAudio", undefined);
        });

        test("should add to audio queue and reset state", () => {
            const results = getResults(rule, {
                publicAudioQueue: ["bar.mp3"],
                playDiscordAudio: "foo.mp3",
                discordAudioEnabled: true,
            }) as Fact<string[]>[];

            expect(results).toContainTopic("publicAudioQueue");
            expect(results[0].value[0]).toContain("bar.mp3");
            expect(results[0].value[1]).toContain("foo.mp3");

            expect(results).toContainFact("playDiscordAudio", undefined);
        });
    });

    describe("discord audio disabled", () => {
        test("should reset state", () => {
            const results = getResults(rule, {
                playDiscordAudio: "foo.mp3",
                discordAudioEnabled: false,
            }) as Fact<string[]>[];

            expect(results).toContainFact("publicAudioQueue", []);
            expect(results).toContainFact("playDiscordAudio", undefined);
        });
    });
});
