/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
jest.mock("../customEngine");
jest.mock("../engine/topicManager");
import { EffectConfig } from "../effectConfigManager";
import engine from "../customEngine";
const request = require("supertest");
import sut from "../server";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";
import Fact from "../engine/Fact";

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

        test("get-config", (done) => {
            const configTopicOne = new Topic<EffectConfig>("configTopicOne");
            const configTopicTwo = new Topic<EffectConfig>("configTopicTwo");
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
        test("update-config", (done) => {
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
    });
});
