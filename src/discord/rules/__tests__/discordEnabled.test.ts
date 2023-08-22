jest.mock("../../discordHelpers");
import helper from "../../discordHelpers";
import rule from "../discordEnabled";

describe("discordAudioEnabled", () => {
    test("we do not have a guildId, disable audio", () => {
        const result = getResults(rule, {
            discordGuildId: null,
            discordGuildChannelId: "channelId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("we do not have a channelId, disable audio", () => {
        const result = getResults(rule, {
            discordGuildId: "channelId",
            discordGuildChannelId: null,
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("we have guild and channel id and we are the only one connected to guild", () => {
        (helper.numberOfPeopleConnected as jest.Mock).mockReturnValue(1);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("we have guild and channel id and someone else is connected to guild", () => {
        (helper.numberOfPeopleConnected as jest.Mock).mockReturnValue(2);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("updates the front end", () => {
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("updateFrontend", true);
    });
});
