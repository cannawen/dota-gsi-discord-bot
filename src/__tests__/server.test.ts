/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
jest.mock("../customEngine");
jest.mock("../effectConfigManager");
jest.mock("../engine/topicManager");
jest.mock("../log");
jest.mock("../gsiParser");
import effectConfig, { EffectConfig } from "../effectConfigManager";
import engine from "../customEngine";
import Fact from "../engine/Fact";
import gsiParser from "../gsiParser";
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
        describe("start coaching", () => {
            let req: any;
            beforeEach(() => {
                req = request(sut).post("/coach/studentId/start");
            });
            test("should return 200", (done) => {
                req.expect(200, done);
            });
            test("has existing session", (done) => {
                (engine.getSession as jest.Mock).mockReturnValue(jest.fn());

                req.end((error: any) => {
                    if (error) return done(error);
                    expect(engine.getSession).toHaveBeenCalledWith("studentId");
                    expect(engine.startCoachingSession).not.toHaveBeenCalled();
                    return done();
                });
            });
            test("does not have existing session", (done) => {
                (engine.getSession as jest.Mock).mockReturnValue(undefined);
                req.end((error: any) => {
                    if (error) return done(error);
                    expect(engine.startCoachingSession).toHaveBeenCalledWith(
                        "studentId"
                    );
                    return done();
                });
            });
        });
        test("stop coaching notifies engine to delete student's session", (done) => {
            request(sut)
                .post("/coach/studentId/stop")
                .expect(200)
                .end((error: any) => {
                    if (error) return done(error);
                    expect(engine.deleteSession).toHaveBeenCalledWith(
                        "studentId"
                    );
                    return done();
                });
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
            let configTopicTwo: any;
            let configTopicThree: any;
            beforeEach(() => {
                const configTopicOne = new Topic<EffectConfig>(
                    "configTopicOne"
                );
                configTopicTwo = new Topic<EffectConfig>("configTopicTwo");
                configTopicThree = new Topic<EffectConfig>("configTopicThree");
                const configTopicFour = new Topic<EffectConfig>(
                    "configTopicFour"
                );
                (topicManager.getConfigTopics as jest.Mock).mockReturnValue([
                    configTopicOne,
                    configTopicTwo,
                    configTopicThree,
                    configTopicFour,
                ]);

                (engine.getFactValue as jest.Mock).mockImplementation(
                    (studentId, topic) => {
                        if (topic.label === "configTopicOne") {
                            return EffectConfig.PRIVATE;
                        }
                        if (topic.label === "configTopicTwo") {
                            return EffectConfig.PUBLIC;
                        }
                        if (topic.label === "configTopicThree") {
                            return EffectConfig.PUBLIC_INTERRUPTING;
                        }
                        if (topic.label === "configTopicFour") {
                            return EffectConfig.NONE;
                        }
                    }
                );
                const factOne = new Fact(configTopicOne, EffectConfig.PRIVATE);
                const factTwo = new Fact(configTopicTwo, EffectConfig.PUBLIC);
                const factThree = new Fact(
                    configTopicThree,
                    EffectConfig.PUBLIC_INTERRUPTING
                );
                const factFour = new Fact(configTopicFour, EffectConfig.NONE);
                (effectConfig.defaultConfigs as jest.Mock).mockReturnValue([
                    factOne,
                    factTwo,
                    factThree,
                    factFour,
                ]);
            });

            test("get all", (done) => {
                request(sut)
                    .get("/coach/studentId/config/get")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect(
                        JSON.stringify([
                            ["configTopicOne", "PRIVATE", null],
                            ["configTopicTwo", "PUBLIC", null],
                            ["configTopicThree", "PUBLIC_INTERRUPTING", null],
                            ["configTopicFour", "NONE", null],
                        ])
                    )
                    .end((error: any) => {
                        if (error) return done(error);
                        expect(engine.getFactValue).toHaveBeenCalledWith(
                            "studentId",
                            expect.anything()
                        );
                        return done();
                    });
            });
            test("update", (done) => {
                request(sut)
                    .post("/coach/studentId/config/configTopicTwo/NONE")
                    .expect(200)
                    .end((error: any) => {
                        if (error) return done(error);
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            new Fact(configTopicTwo, EffectConfig.NONE)
                        );
                        return done();
                    });
            });
            test("reset", (done) => {
                request(sut)
                    .post("/coach/studentId/config/reset")
                    .expect(200, (error: any) => {
                        if (error) return done(error);
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            expect.any(Fact)
                        );
                        expect(engine.setFact).toHaveBeenCalledTimes(4);
                        return done();
                    });
            });
            test("make all enabled private", (done) => {
                request(sut)
                    .post("/coach/studentId/config/PRIVATE")
                    .expect(200, (error: any) => {
                        if (error) return done(error);
                        expect(engine.setFact).toHaveBeenCalledTimes(2);
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            new Fact(configTopicTwo, EffectConfig.PRIVATE)
                        );
                        expect(engine.setFact).toHaveBeenCalledWith(
                            "studentId",
                            new Fact(configTopicThree, EffectConfig.PRIVATE)
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

            describe("config updated and should update front end", () => {
                test("true", (done) => {
                    (engine.getFactValue as jest.Mock).mockImplementation(
                        (studentId: string, topic: Topic<unknown>) => {
                            if (topic.label === "updateFrontend") {
                                return true;
                            }
                        }
                    );
                    req.expect(JSON.stringify({ updateFrontend: true }), done);
                });
                test("false", (done) => {
                    (engine.getFactValue as jest.Mock).mockImplementation(
                        (studentId: string, topic: Topic<unknown>) => {
                            if (topic.label === "updateFrontend") {
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

    describe("gsi", () => {
        test("head", (done) => {
            request(sut).head("/gsi").expect(200, done);
        });
        test("data", (done) => {
            request(sut)
                .post("/gsi")
                .expect(200, (error: any) => {
                    if (error) return done(error);
                    expect(gsiParser.feedState).toHaveBeenCalledWith({});
                    return done();
                });
        });
    });
});
