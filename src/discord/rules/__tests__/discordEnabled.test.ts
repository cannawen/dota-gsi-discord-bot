jest.mock("../../../customEngine");

import engine from "../../../customEngine";
import { getResults } from "../../../__tests__/helpers";
import rule from "../discordEnabled";

describe("discordEnabled", () => {
    test("no one else already connected", () => {
        jest.spyOn(engine, "alreadyConnectedToVoiceChannel").mockReturnValue(
            false
        );
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("someone else already connected", () => {
        jest.spyOn(engine, "alreadyConnectedToVoiceChannel").mockReturnValue(
            true
        );
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
});
