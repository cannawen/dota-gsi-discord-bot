jest.mock("../effectConfigManager");
jest.mock("../engine/topicManager");
jest.mock("../log");
jest.mock("../persistence");

import effectConfig, { EffectConfig } from "../effectConfigManager";
import PersistentFactStore, {
    factsToPlainObject,
} from "../engine/PersistentFactStore";
import { CustomEngine } from "../customEngine";
import Fact from "../engine/Fact";
import persistence from "../persistence";
import PersistentTopic from "../engine/PersistentTopic";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";

describe("customEngine", () => {
    let sut: CustomEngine;
    beforeEach(() => {
        sut = new CustomEngine();
    });

    describe("getSession", () => {
        test("returns persistent fact store", () => {
            sut.startCoachingSession("studentId", "guildId", "channelId");
            expect(sut.getSession("studentId")).toBeInstanceOf(
                PersistentFactStore
            );
        });
    });

    describe("startCoachingSession", () => {
        describe("has discord guild and channel id", () => {
            test("saves guild and channel facts to db", () => {
                sut.startCoachingSession("studentId", "guildId", "channelId");
                expect(
                    sut.getFactValue("studentId", topics.discordGuildId)
                ).toBe("guildId");
                expect(
                    sut.getFactValue("studentId", topics.discordGuildChannelId)
                ).toBe("channelId");
            });
        });
        describe("missing discord guild or channel id", () => {
            test("saves fact that discord ids are null", () => {
                sut.startCoachingSession("studentId");
                expect(
                    sut.getFactValue("studentId", topics.discordGuildId)
                ).toBe(null);
                expect(
                    sut.getFactValue("studentId", topics.discordGuildChannelId)
                ).toBe(null);
            });
        });
        describe("sets up configurations", () => {
            let topicOne: Topic<EffectConfig>;
            let topicTwo: Topic<EffectConfig>;
            beforeEach(() => {
                topicOne = new Topic<EffectConfig>("configTopicOne");
                topicTwo = new Topic<EffectConfig>("configTopicTwo");

                (effectConfig.defaultConfigs as jest.Mock).mockReturnValue([
                    new Fact(topicOne, EffectConfig.PRIVATE),
                    new Fact(topicTwo, EffectConfig.PUBLIC),
                ]);
            });
            describe("no saved configs", () => {
                test("should use default configs", () => {
                    sut.startCoachingSession(
                        "studentId",
                        "guildId",
                        "channelId"
                    );
                    expect(sut.getFactValue("studentId", topicOne)).toBe(
                        "PRIVATE"
                    );
                    expect(sut.getFactValue("studentId", topicTwo)).toBe(
                        "PUBLIC"
                    );
                });
            });
            describe("has saved configs", () => {
                beforeEach(() => {
                    (persistence.readStudentData as jest.Mock).mockReturnValue(
                        JSON.stringify(
                            factsToPlainObject([
                                new Fact(topicTwo, EffectConfig.PRIVATE),
                            ])
                        )
                    );
                });
                test("should use default configs augmented with saved config", () => {
                    sut.startCoachingSession(
                        "studentId",
                        "guildId",
                        "channelId"
                    );
                    expect(sut.getFactValue("studentId", topicOne)).toBe(
                        "PRIVATE"
                    );
                    expect(sut.getFactValue("studentId", topicTwo)).toBe(
                        "PRIVATE"
                    );
                });
                describe("saved configs throws error", () => {
                    test("should delete saved configs and use defualt config", () => {
                        (
                            topicManager.findTopic as jest.Mock
                        ).mockImplementation(() => {
                            throw new Error();
                        });
                        sut.startCoachingSession(
                            "studentId",
                            "guildId",
                            "channelId"
                        );
                        expect(
                            persistence.deleteStudentData
                        ).toHaveBeenCalledWith("studentId");
                        expect(
                            effectConfig.defaultConfigs
                        ).toHaveBeenCalledTimes(1);
                    });
                });
            });
        });
    });

    describe("two coaching sessions started", () => {
        beforeEach(() => {
            sut.startCoachingSession("studentId", "guildId", "channelId");
            sut.startCoachingSession("studentId2", "guildId2", "channelId2");
        });
        describe("getSessions", () => {
            test("returns all sessions", () => {
                expect(sut.getSessions().size).toEqual(2);
                expect([...sut.getSessions().keys()]).toEqual([
                    "studentId",
                    "studentId2",
                ]);
            });
        });

        describe("deleteSession", () => {
            test("deletes correct session", () => {
                sut.deleteSession("studentId");
                expect(sut.getSession("studentId")).toBeUndefined();
                expect(sut.getSession("studentId2")).not.toBeUndefined();
            });
            test("disconnects from voice connection", () => {
                const spyGet = jest.spyOn(sut.getSession("studentId")!, "get");
                const mockSubscription: any = {
                    connection: { destroy: jest.fn() },
                };
                sut.setFact(
                    "studentId",
                    new Fact(topics.discordSubscriptionTopic, mockSubscription)
                );
                sut.deleteSession("studentId");
                expect(spyGet).toHaveBeenCalledWith(
                    topics.discordSubscriptionTopic
                );
                expect(
                    mockSubscription.connection.destroy
                ).toHaveBeenCalledTimes(1);
            });
            test("saves forever facts to persistence", () => {
                const topic = new PersistentTopic<string>("persistentTopic", {
                    persistForever: true,
                });
                sut.setFact("studentId", new Fact(topic, "hello"));
                sut.setFact(
                    "studentId",
                    new Fact(new Topic<string>("topic"), "world")
                );
                sut.deleteSession("studentId");
                expect(persistence.saveStudentData).toHaveBeenCalledWith(
                    "studentId",
                    '{"persistentTopic":"hello"}'
                );
            });
        });
    });
});
