import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";
import engine from "../customEngine";
import fs from "fs";
import log from "../log";
import path from "path";

function hashStudentId(userId: string) {
    const key = process.env.STUDENT_ID_HASH_PRIVATE_KEY;
    if (key) {
        return CryptoJS.HmacSHA256(userId, key).toString();
    } else {
        log.error(
            "discord",
            "Unable to find %s environment variable, so continuing without hashing. Check your .env file",
            "STUDENT_ID_HASH_PRIVATE_KEY"
        );
        return userId;
    }
}

function generateConfigFile(userId: string) {
    return fs
        .readFileSync(
            path.join(__dirname, "../../data/configInstructions.txt"),
            "utf8"
        )
        .replace(/insert_student_id_here/g, userId);
}

function handleConfig(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction
        .reply({
            content: generateConfigFile(hashStudentId(interaction.user.id)),
            ephemeral: true,
        })
        .catch((e) => {
            log.error("discord", "Interaction error %s", e);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        });
}

function handleCoachMe(interaction: ChatInputCommandInteraction<CacheType>) {
    if (interaction.channel?.isVoiceBased && interaction.guildId) {
        engine.startCoachingSession(
            hashStudentId(interaction.user.id),
            interaction.guildId,
            interaction.channelId
        );
        interaction.reply({
            content:
                "Starting...\n\nMake sure you have used the config command to add the Game State Integration configuration file to your computer",
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: "Bot must be started in voice-based guild channel",
            ephemeral: true,
        });
    }
}

function handleStop(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
        content: "Ending...",
        ephemeral: true,
    });
    // TODO have bot leave the channel
    engine.stopCoachingSession(hashStudentId(interaction.user.id));
}

export default {
    handleConfig,
    handleCoachMe,
    handleStop,
};
