jest.mock("fs");
jest.mock("../../customEngine");
jest.mock("../tts");
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import fs from "fs";
import rule from "../playPublicAudio";
import topics from "../../topics";
import tts from "../tts";

describe("playAudio", () => {
    describe("discord audio enabled", () => {
        describe("audio file exists", () => {
            beforeEach(() => {
                (fs.existsSync as jest.Mock).mockReturnValue(true);
            });
            test("should create audio queue", () => {
                const results = getResults(rule, {
                    playPublicAudio: "foo.mp3",
                    discordAudioEnabled: true,
                }) as Fact<string[]>[];

                expect(results).toContainFact("publicAudioQueue", [
                    expect.stringContaining("foo.mp3"),
                ]);
            });
            test("should add to audio queue and reset state", () => {
                const results = getResults(rule, {
                    publicAudioQueue: ["bar.mp3"],
                    playPublicAudio: "foo.mp3",
                    discordAudioEnabled: true,
                }) as Fact<string[]>[];

                expect(results).toContainFact("publicAudioQueue", [
                    expect.stringContaining("bar.mp3"),
                    expect.stringContaining("foo.mp3"),
                ]);
            });
            test("should reset state", () => {
                const results = getResults(rule, {
                    playPublicAudio: "foo.mp3",
                    discordAudioEnabled: true,
                }) as Fact<string[]>[];

                expect(results).not.toContainTopic("playPublicAudio");
            });
        });
        describe("cached file exists", () => {
            beforeEach(() => {
                (fs.existsSync as jest.Mock)
                    .mockReturnValueOnce(false)
                    .mockReturnValueOnce(true);
            });
            test("should add to audio queue", () => {
                const results = getResults(rule, {
                    playPublicAudio: "foo",
                    discordAudioEnabled: true,
                }) as Fact<string[]>[];

                expect(results).toContainFact("publicAudioQueue", [
                    expect.stringContaining("test-tts-path/foo.mp3"),
                ]);
            });
        });

        describe("cached file does not exist", () => {
            beforeEach(() => {
                (fs.existsSync as jest.Mock).mockReturnValue(false);
            });
            test("should ask tts to create audio and directly set on engine", () => {
                const results = getResults(rule, {
                    discordAudioEnabled: true,
                    publicAudioQueue: ["foo"],
                    studentId: "studentId",
                    playPublicAudio: "text to speech message",
                }) as Fact<string[]>[];

                expect(results).toContainFact("publicAudioQueue", ["foo"]);
                expect(tts.create).toHaveBeenCalledWith(
                    "text to speech message"
                );
                const axiosPromise = (tts.create as jest.Mock).mock.results[0]
                    .value;
                return axiosPromise.then(() => {
                    expect(engine.setFact).toHaveBeenCalledWith(
                        "studentId",
                        new Fact(
                            topics.playPublicAudio,
                            "text to speech message"
                        )
                    );
                });
            });
        });
    });

    describe("discord audio disabled", () => {
        test("should reset state", () => {
            const results = getResults(rule, {
                playPublicAudio: "foo.mp3",
                discordAudioEnabled: false,
            }) as Fact<string[]>[];

            expect(results).not.toContainFact("publicAudioQueue");
            expect(results).not.toContainTopic("playPublicAudio");
        });
    });
});
