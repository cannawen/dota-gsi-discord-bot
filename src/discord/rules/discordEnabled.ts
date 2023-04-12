import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule(
    "discord/enabled",
    [topics.discordGuildId, topics.discordGuildChannelId],
    (get) => {
        const guildId = get(topics.discordGuildId)!;
        const channelId = get(topics.discordGuildChannelId)!;

        const alreadyConnected = Array.from(
            engine.getSessions().values()
        ).reduce((memo, db) => {
            const existingGuildId = db.get(topics.discordGuildId);
            const existingChannelId = db.get(topics.discordGuildChannelId);
            return (
                memo ||
                (existingGuildId === guildId && existingChannelId === channelId)
            );
        }, false);

        return new Fact(topics.discordAudioEnabled, !alreadyConnected);
    }
);
