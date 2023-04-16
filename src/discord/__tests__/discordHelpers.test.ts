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
            const factStore = new FactStore();
            factStore.set(new Fact(topics.discordGuildId, "guildId"));
            factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
            sessions.set("studentId", factStore);
            (engine.getSessions as jest.Mock).mockReturnValue(sessions);
        });

        test("Only one person connected to guildId, channelId", () => {
            const factStore = new FactStore();
            factStore.set(new Fact(topics.discordGuildId, "different-guildId"));
            factStore.set(
                new Fact(topics.discordGuildChannelId, "different-channelId")
            );
            sessions.set("someone-else", factStore);

            expect(sut.numberOfPeopleConnected("guildId", "channelId")).toBe(1);
        });
        test("Two people connected to guildId, channelId", () => {
            const factStore = new FactStore();
            factStore.set(new Fact(topics.discordGuildId, "guildId"));
            factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
            sessions.set("someone-else", factStore);

            expect(sut.numberOfPeopleConnected("guildId", "channelId")).toBe(2);
        });
    });
});
