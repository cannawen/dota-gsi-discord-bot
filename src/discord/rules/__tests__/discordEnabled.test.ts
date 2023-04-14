jest.mock("../../../customEngine");

import engine from "../../../customEngine";
import Fact from "../../../engine/Fact";
import FactStore from "../../../engine/FactStore";
import { getResults } from "../../../__tests__/helpers";
import rule from "../discordEnabled";
import topics from "../../../topics";

describe("discordEnabled", () => {
    test("no one else already connected", () => {
        (engine.getSessions as jest.Mock).mockReturnValue(new Map());
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("someone else already connected", () => {
        const map = new Map();
        const factStore = new FactStore();
        factStore.set(new Fact(topics.discordGuildId, "guildId"));
        factStore.set(new Fact(topics.discordGuildChannelId, "channelId"));
        map.set("someone-else", factStore);

        (engine.getSessions as jest.Mock).mockReturnValue(map);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
});
