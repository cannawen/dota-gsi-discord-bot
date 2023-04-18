import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildId, topics.discordGuildChannelId],
    (get) => {
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
