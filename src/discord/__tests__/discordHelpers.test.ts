jest.mock("../../customEngine");

import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import FactStore from "../../engine/FactStore";
import sut from "../discordHelpers";
import topics from "../../topics";

describe("discordHelpers", () => {
    describe("numberOfPeopleConnected", () => {
        let sessions: Map<string, FactStore>;
        beforeEach(() => {
            sessions = new Map();
            const db1 = new FactStore();
            db1.set(new Fact(topics.discordGuildId, "guildId"));
            db1.set(new Fact(topics.discordGuildChannelId, "channelId"));
            sessions.set("studentId", db1);

            const db2 = new FactStore();
            db2.set(new Fact(topics.discordGuildId, "different-guildId"));
            db2.set(
                new Fact(topics.discordGuildChannelId, "different-channelId")
            );
            sessions.set("random-person", db2);

            (engine.getSessions as jest.Mock).mockReturnValue(sessions);
        });

        test("Only one person connected to guildId, channelId", () => {
            expect(sut.numberOfPeopleConnected("guildId", "channelId")).toBe(1);
        });
        test("Two people connected to guildId, channelId", () => {
            const db = new FactStore();
            db.set(new Fact(topics.discordGuildId, "guildId"));
            db.set(new Fact(topics.discordGuildChannelId, "channelId"));
            sessions.set("someone-else", db);

            expect(sut.numberOfPeopleConnected("guildId", "channelId")).toBe(2);
        });
    });
});
