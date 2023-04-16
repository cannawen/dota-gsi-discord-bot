import Fact from "../../engine/Fact";
import helper from "../discordHelpers";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildId, topics.discordGuildChannelId],
    (get) => {
        const guildId = get(topics.discordGuildId)!;
        const channelId = get(topics.discordGuildChannelId)!;

        // If we are the only person connected to guild and channel, enable discord.
        // Update the front end when we change discord enabledness
        return [
            new Fact(
                topics.discordAudioEnabled,
                helper.numberOfPeopleConnected(guildId, channelId) === 1
            ),
            new Fact(topics.updateFrontend, true),
        ];
    }
);
