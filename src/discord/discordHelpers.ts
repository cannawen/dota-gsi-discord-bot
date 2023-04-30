import Engine from "../engine/Engine";
import engine from "../customEngine";
import topics from "../topics";

function numberOfPeopleConnected(guildId: string, channelId: string): number {
    return Array.from(engine.getSessions().values()).filter(
        (db) =>
            Engine.get(db, topics.discordGuildId) === guildId &&
            Engine.get(db, topics.discordGuildChannelId) === channelId
    ).length;
}

export default {
    numberOfPeopleConnected,
};
