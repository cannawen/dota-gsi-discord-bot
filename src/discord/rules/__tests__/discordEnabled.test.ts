jest.mock("../../../customEngine");
jest.mock("../../discordHelpers");

import { getResults } from "../../../__tests__/helpers";
import helpers from "../../discordHelpers";
import rule from "../discordEnabled";

describe("discordEnabled", () => {
    test("we are the only ones connected to guild+channel", () => {
        (helpers.numberOfPeopleConnected as jest.Mock).mockReturnValue(1);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("someone else is also connected to same guild+channel", () => {
        (helpers.numberOfPeopleConnected as jest.Mock).mockReturnValue(2);

        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("passes proper params into numberOfPeopleConnected", () => {
        getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(helpers.numberOfPeopleConnected).toHaveBeenCalledWith(
            "guildId",
            "channelId"
        );
    });
    test("updates the front end", () => {
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("configUpdated", true);
    });
});
