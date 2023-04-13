jest.mock("../persistence");
jest.mock("../effectConfigManager");
jest.mock("../engine/topicManager");

import config, { EffectConfig } from "../effectConfigManager";
import PersistentFactStore, {
    factsToPlainObject,
} from "../engine/PersistentFactStore";
import { CustomEngine } from "../customEngine";
import Fact from "../engine/Fact";
import persistence from "../persistence";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";

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

        describe("sets up configurations", () => {
            let configFacts: Fact<EffectConfig>[];
            let topicOne: Topic<EffectConfig>;
            let topicTwo: Topic<EffectConfig>;
            beforeEach(() => {
                topicOne = new Topic<EffectConfig>("configTopicOne");
                topicTwo = new Topic<EffectConfig>("configTopicTwo");
                configFacts = [
                    new Fact(topicOne, config.EffectConfig.PRIVATE),
                    new Fact(topicTwo, config.EffectConfig.PUBLIC),
                ];
            });

            describe("no saved configs", () => {
                test("should use default configs", () => {
                    jest.spyOn(config, "defaultConfigs").mockReturnValue(
                        configFacts
                    );
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
                test("should use saved config", () => {
                    jest.spyOn(persistence, "readStudentData").mockReturnValue(
                        JSON.stringify(factsToPlainObject(configFacts))
                    );
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
    });
});
