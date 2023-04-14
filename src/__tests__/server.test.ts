/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
jest.mock("../customEngine");
jest.mock("../effectConfigManager");
jest.mock("../engine/topicManager");
jest.mock("../log");
import config, { EffectConfig } from "../effectConfigManager";
import engine from "../customEngine";
import Fact from "../engine/Fact";
import request from "supertest";
import sut from "../server";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";

describe("server", () => {
    test("instructions", (done) => {
        request(sut)
            .get("/instructions")
            .expect("Content-Type", /html/)
            .expect(200, done);
    });

    describe("studentPage", () => {
        test("student page", (done) => {
            request(sut)
                .get("/coach/studentId/")
                .expect("Content-Type", /html/)
                .expect(200, done);
        });

        describe("discordAudioEnabled", () => {
            let req: any;
            beforeEach(() => {
                req = request(sut)
                    .get("/coach/studentId/discord-audio-enabled")
                    .expect("Content-Type", /json/)
                    .expect(200);
            });
            test("calls engine with correct values", (done) => {
                req.expect("false").end((error: any) => {
                    if (error) return done(error);
                    expect(engine.getFactValue).toHaveBeenCalledWith(
                        "studentId",
                        topics.discordAudioEnabled
                    );
                    return done();
                });
            });
            test("true", (done) => {
                (engine.getFactValue as jest.Mock).mockReturnValue(true);
                req.expect("true", done);
            });
            test("false", (done) => {
                (engine.getFactValue as jest.Mock).mockReturnValue(false);
                req.expect("false", done);
            });
        });
        describe("configuration management", () => {
            test("get all", (done) => {
                const configTopicOne = new Topic<EffectConfig>(
                    "configTopicOne"
                );
                const configTopicTwo = new Topic<EffectConfig>(
                    "configTopicTwo"
                );
                (topicManager.getConfigTopics as jest.Mock).mockReturnValue([
                    configTopicOne,
                    configTopicTwo,
                ]);
                (engine.getFactValue as jest.Mock)
                    .mockReturnValueOnce("PRIVATE")
                    .mockReturnValueOnce("PUBLIC");

                request(sut)
                    .get("/coach/studentId/get-config")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect(
                        JSON.stringify([
                            ["configTopicOne", "PRIVATE"],
                            ["configTopicTwo", "PUBLIC"],
                        ])
                    )
                    .end((error: any) => {
                        if (error) return done(error);
                        expect(engine.getFactValue).toHaveBeenCalledWith(
                            "studentId",
                            configTopicOne
                        );
                        expect(engine.getFactValue).toHaveBeenCalledWith(
                            "studentId",
                            configTopicTwo
                        );
                        return done();
                    });
            });
            test("update", (done) => {
                request(sut)
                    .post("/coach/studentId/config/configTopicOne/PUBLIC")
                    .expect(200)
                    .end((error: any) => {
                        if (error) return done(error);
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            new Fact(
                                new Topic<EffectConfig>("configTopicOne"),
                                EffectConfig.PUBLIC
                            )
                        );
                        return done();
                    });
            });
            test("reset", (done) => {
                const factOne = new Fact(
                    new Topic<EffectConfig>("configTopicOne"),
                    EffectConfig.PRIVATE
                );
                const factTwo = new Fact(
                    new Topic<EffectConfig>("configTopicTwo"),
                    EffectConfig.PUBLIC
                );
                (config.defaultConfigs as jest.Mock).mockReturnValue([
                    factOne,
                    factTwo,
                ]);
                request(sut)
                    .post("/coach/studentId/reset-config")
                    .expect(200, (error: any) => {
                        if (error) return done(error);
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            factOne
                        );
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            factTwo
                        );
                        return done();
                    });
            });
        });
        describe("polling", () => {
            let req: any;
            beforeEach(() => {
                req = request(sut)
                    .get("/coach/studentId/poll")
                    .expect("Content-Type", /json/)
                    .expect(200);
            });
            describe("playing private audio", () => {
                test("has audio", (done) => {
                    (engine.getFactValue as jest.Mock).mockImplementation(
                        (studentId: string, topic: Topic<unknown>) => {
                            if (topic.label === "privateAudioQueue") {
                                return ["foo.mp3", "bar.mp3"];
                            }
                        }
                    );
                    req.expect(JSON.stringify({ nextAudio: "foo.mp3" })).end(
                        (error: any) => {
                            if (error) return done(error);
                            expect(engine.setFact).toHaveBeenCalledWith(
                                "studentId",
                                new Fact(
                                    new Topic<string[]>("privateAudioQueue"),
                                    ["bar.mp3"]
                                )
                            );
                            return done();
                        }
                    );
                });
                test("has no audio", (done) => {
                    (engine.getFactValue as jest.Mock).mockReturnValue(
                        undefined
                    );
                    req.expect(null, done);
                });
            });

            describe("config updated", () => {
                test("true", (done) => {
                    (engine.getFactValue as jest.Mock).mockImplementation(
                        (studentId: string, topic: Topic<unknown>) => {
                            if (topic.label === "configUpdated") {
                                return true;
                            }
                        }
                    );
                    req.expect(JSON.stringify({ configUpdated: true }), done);
                });
                test("false", (done) => {
                    (engine.getFactValue as jest.Mock).mockImplementation(
                        (studentId: string, topic: Topic<unknown>) => {
                            if (topic.label === "configUpdated") {
                                return false;
                            }
                        }
                    );
                    req.expect(null, done);
                });
            });
        });
        test("stop audio", (done) => {
            request(sut)
                .post("/coach/studentId/stop-audio")
                .expect(200, (error: any) => {
                    if (error) return done(error);
                    expect(engine.setFact).toHaveBeenCalledWith(
                        "studentId",
                        new Fact(new Topic<boolean>("stopAudio"), true)
                    );
                    expect(engine.setFact).toHaveBeenCalledWith(
                        "studentId",
                        new Fact(
                            new Topic<string[]>("privateAudioQueue"),
                            undefined
                        )
                    );
                    expect(engine.setFact).toHaveBeenCalledWith(
                        "studentId",
                        new Fact(
                            new Topic<string[]>("publicAudioQueue"),
                            undefined
                        )
                    );
                    return done();
                });
        });
    });
});
