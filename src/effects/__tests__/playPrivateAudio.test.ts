import Fact from "../../engine/Fact";
import { getResults } from "../../__tests__/helpers";
import rule from "../playPrivateAudio";

describe("playPrivateAudio", () => {
    describe("discord audio enabled", () => {
        test("should create audio queue and reset state", () => {
            const results = getResults(rule, {
                playPrivateAudioFile: "foo.mp3",
            }) as Fact<string[]>[];

            expect(results).toContainTopic("privateAudioQueue");
            expect(results[0].value[0]).toContain("foo.mp3");

            expect(results).toContainFact("playPrivateAudioFile", undefined);
        });

        test("should add to audio queue and reset state", () => {
            const results = getResults(rule, {
                privateAudioQueue: ["bar.mp3"],
                playPrivateAudioFile: "foo.mp3",
            }) as Fact<string[]>[];

            expect(results).toContainTopic("privateAudioQueue");
            expect(results[0].value[0]).toContain("bar.mp3");
            expect(results[0].value[1]).toContain("foo.mp3");

            expect(results).toContainFact("playPrivateAudioFile", undefined);
        });
    });
});
