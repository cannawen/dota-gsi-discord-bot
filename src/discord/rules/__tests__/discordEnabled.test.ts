import { getResults } from "../../../__tests__/helpers";
import rule from "../discordEnabled";

describe("discordEnabled", () => {
    test("we do not have a guildId, disable audio", () => {
        const result = getResults(rule, {
            guildId: null,
            channelId: "channelId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("we do not have a channelId, disable audio", () => {
        const result = getResults(rule, {
            guildId: "channelId",
            channelId: null,
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("we have guild and channel id", () => {
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("updates the front end", () => {
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("updateFrontend", true);
    });
});
