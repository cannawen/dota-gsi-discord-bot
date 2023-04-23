jest.mock("fs");
jest.mock("../tts");
jest.mock("../../customEngine");
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import fs from "fs";
import rule from "../playPrivateAudio";
import topics from "../../topics";
import tts from "../tts";

describe("playPrivateAudio", () => {
    describe("audio file exists", () => {
        beforeEach(() => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
        });
        test("should create audio queue", () => {
            const results = getResults(rule, {
                playPrivateAudio: "foo.mp3",
            }) as Fact<string[]>[];

            expect(results).toContainFact("privateAudioQueue", [
                expect.stringContaining("foo.mp3"),
            ]);
        });
        test("should add to audio queue", () => {
            const results = getResults(rule, {
                privateAudioQueue: ["bar.mp3"],
                playPrivateAudio: "foo.mp3",
            }) as Fact<string[]>[];

            expect(results).toContainFact("privateAudioQueue", [
                expect.stringContaining("bar.mp3"),
                expect.stringContaining("foo.mp3"),
            ]);
        });
        test("should reset state", () => {
            const results = getResults(rule, {
                playPrivateAudio: "foo.mp3",
            }) as Fact<string[]>[];
            expect(results).toContainFact("playPrivateAudio", undefined);
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
                privateAudioQueue: [],
                playPrivateAudio: "foo",
            }) as Fact<string[]>[];

            expect(results).toContainFact("privateAudioQueue", [
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
                studentId: "studentId",
                privateAudioQueue: [],
                playPrivateAudio: "text to speech message",
            }) as Fact<string[]>[];

            expect(results).toContainFact("privateAudioQueue", []);
            expect(tts.create).toHaveBeenCalledWith("text to speech message");
            const axiosPromise = (tts.create as jest.Mock).mock.results[0]
                .value;
            return axiosPromise.then(() => {
                expect(engine.setFact).toHaveBeenCalledWith(
                    "studentId",
                    new Fact(topics.playPrivateAudio, "text to speech message")
                );
            });
        });
    });
});
