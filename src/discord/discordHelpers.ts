import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";
import engine from "../customEngine";
import log from "../log";
import topics from "../topics";

function numberOfPeopleConnected(guildId: string, channelId: string): number {
    return Array.from(engine.getSessions().values()).filter(
        (db) =>
            db.get(topics.discordGuildId) === guildId &&
            db.get(topics.discordGuildChannelId) === channelId
    ).length;
}

function studentId(interaction: ChatInputCommandInteraction<CacheType>) {
    const key = process.env.STUDENT_ID_HASH_PRIVATE_KEY;
    if (key) {
        // eslint-disable-next-line new-cap
        return CryptoJS.HmacSHA256(interaction.user.id, key).toString();
    } else {
        log.error(
            "discord",
            "Unable to find %s environment variable, so continuing without hashing. Check your .env file",
            "STUDENT_ID_HASH_PRIVATE_KEY"
        );
        return interaction.user.id;
    }
}

export default {
    studentId,
    numberOfPeopleConnected,
};
