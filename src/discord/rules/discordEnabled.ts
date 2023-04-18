import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildId, topics.discordGuildChannelId],
    (get) => {
        // guild and channel id might be set to null
        // when we are coaching without public audio
        const guildId = get(topics.discordGuildId);
        const channelId = get(topics.discordGuildChannelId);

        return [
            new Fact(
                topics.discordAudioEnabled,
                guildId !== null && channelId !== null
            ),
            new Fact(topics.updateFrontend, true),
        ];
    }
);
