import Fact from "../../engine/Fact";
import { getResults } from "../../__tests__/helpers";
import rule from "../playAudio";

describe("playAudio", () => {
    describe("discord audio enabled", () => {
        test("should add to audio queue and reset state", () => {
            const results = getResults(rule, {
                playPublicAudioFile: "foo.mp3",
                discordAudioEnabled: true,
            }) as Fact<string[]>[];
            expect(results).toContainTopic("publicAudioQueue");
            expect(results[0].value[0]).toContain("foo.mp3");
            expect(results).toContainFact("playPublicAudioFile", undefined);
        });
    });

    describe("discord audio disabled", () => {
        test("should reset state", () => {
            const results = getResults(rule, {
                playPublicAudioFile: "foo.mp3",
                discordAudioEnabled: false,
            }) as Fact<string[]>[];
            expect(results).not.toContainTopic("publicAudioQueue");
            expect(results).toContainFact("playPublicAudioFile", undefined);
        });
    });
});
