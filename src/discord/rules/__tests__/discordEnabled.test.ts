jest.mock("../../../customEngine");
jest.mock("../../discordHelpers");

import { getResults } from "../../../__tests__/helpers";
import helpers from "../../discordHelpers";
import rule from "../discordEnabled";

describe("discordEnabled", () => {
    test("we do not have a guildId, disable audio", () => {
        (helpers.numberOfPeopleConnected as jest.Mock).mockReturnValue(1);
        const result = getResults(rule, {
            guildId: null,
            channelId: "channelId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
    test("we do not have a channelId, disable audio", () => {
        (helpers.numberOfPeopleConnected as jest.Mock).mockReturnValue(1);
        const result = getResults(rule, {
            guildId: "channelId",
            channelId: null,
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
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
        expect(result).toContainFact("updateFrontend", true);
    });
});
