import Fact from "../../engine/Fact";
import helper from "../discordHelpers";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildId, topics.discordGuildChannelId],
    (get) => {
        const guildId = get(topics.discordGuildId);
        const channelId = get(topics.discordGuildChannelId);

        let enabled: boolean;

        if (guildId && channelId) {
            // If we are the only person connected to guild and channel, enable discord.
            enabled = helper.numberOfPeopleConnected(guildId, channelId) === 1;
        } else {
            enabled = false;
        }

        return [
            new Fact(topics.discordAudioEnabled, enabled),
            new Fact(topics.updateFrontend, true),
        ];
    }
);
