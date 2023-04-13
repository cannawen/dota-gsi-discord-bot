jest.mock("../persistence");
jest.mock("../effectConfigManager");

import config, { EffectConfig } from "../effectConfigManager";
import { CustomEngine } from "../customEngine";
import Fact from "../engine/Fact";
import persistence from "../persistence";
import PersistentFactStore from "../engine/PersistentFactStore";
import Topic from "../engine/Topic";

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

        describe("no saved configs", () => {
            test("should use default configs", () => {
                const topicOne = new Topic<EffectConfig>("configTopicOne");
                const topicTwo = new Topic<EffectConfig>("configTopicTwo");
                jest.spyOn(persistence, "readStudentData").mockReturnValue(
                    undefined
                );
                jest.spyOn(config, "defaultConfigs").mockReturnValue([
                    new Fact(topicOne, config.EffectConfig.PRIVATE),
                    new Fact(topicTwo, config.EffectConfig.PUBLIC),
                ]);
                sut.startCoachingSession("studentId", "guildId", "channelId");
                expect(sut.getFactValue("studentId", topicOne)).toBe("PRIVATE");
                expect(sut.getFactValue("studentId", topicTwo)).toBe("PUBLIC");
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
