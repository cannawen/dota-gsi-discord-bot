jest.mock("../../../customEngine");

import engine from "../../../customEngine";
import Fact from "../../../engine/Fact";
import FactStore from "../../../engine/FactStore";
import { getResults } from "../../../__tests__/helpers";
import rule from "../discordEnabled";
import topics from "../../../topics";

describe("discordEnabled", () => {
    let map: Map<string, FactStore>;
    beforeEach(() => {
        map = new Map();
        const factStore = new FactStore();
        factStore.set(new Fact(topics.studentId, "studentId"));
        factStore.set(new Fact(topics.discordGuildId, "guildId"));
        factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
        map.set("studentId", factStore);
        (engine.getSessions as jest.Mock).mockReturnValue(map);
    });
    test("no one else connected to same guild+channel", () => {
        const factStore = new FactStore();
        factStore.set(new Fact(topics.studentId, "someone-else"));
        factStore.set(new Fact(topics.discordGuildId, "guildId2"));
        factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
        map.set("someone-else", factStore);

        const result = getResults(rule, {
            studentId: "studentId",
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("someone else already connected to same guild+channel", () => {
        const factStore = new FactStore();
        factStore.set(new Fact(topics.studentId, "someone-else"));
        factStore.set(new Fact(topics.discordGuildId, "guildId"));
        factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
        map.set("someone-else", factStore);

        const result = getResults(rule, {
            studentId: "studentId",
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
});
