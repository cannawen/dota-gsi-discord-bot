const mockAlreadyConnectedToVoiceChannel = jest.fn();
jest.mock("../../../customEngine", () => ({
    alreadyConnectedToVoiceChannel: mockAlreadyConnectedToVoiceChannel,
}));
import { getResults } from "../../../__tests__/helpers";
import rule from "../discordEnabled";

describe("discordEnabled", () => {
    test("no one else already connected", () => {
        mockAlreadyConnectedToVoiceChannel.mockReturnValue(false);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", true);
    });
    test("someone else already connected", () => {
        mockAlreadyConnectedToVoiceChannel.mockReturnValue(true);
        const result = getResults(rule, {
            discordGuildChannelId: "channelId",
            discordGuildId: "guildId",
        });
        expect(result).toContainFact("discordAudioEnabled", false);
    });
});
