import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildChannelId, topics.discordGuildChannelId],
    (get) => {
        const guildId = get(topics.discordGuildChannelId)!;
        const channelId = get(topics.discordGuildChannelId)!;

        const alreadyConnected = engine.alreadyConnectedToVoiceChannel(
            guildId,
            channelId
        );

        return new Fact(topics.discordAudioEnabled, !alreadyConnected);
    }
);
