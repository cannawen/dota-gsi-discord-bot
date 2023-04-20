import engine from "../customEngine";
import topics from "../topics";

function numberOfPeopleConnected(guildId: string, channelId: string): number {
    return Array.from(engine.getSessions().values()).filter(
        (db) =>
            db.get(topics.discordGuildId) === guildId &&
            db.get(topics.discordGuildChannelId) === channelId
    ).length;
}

export default {
    numberOfPeopleConnected,
};
