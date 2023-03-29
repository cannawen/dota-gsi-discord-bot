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
    const serverUrl = process.env.SERVER_URL;
    if (serverUrl) {
        return fs
            .readFileSync(
                path.join(__dirname, "../../resources/configInstructions.txt"),
                "utf8"
            )
            .replace(/SERVER_URL/g, serverUrl)
            .replace(/STUDENT_ID/, userId);
    } else {
        log.error(
            "discord",
            "Unable to generate config file. Ensure %s is set in env",
            "SERVER_URL"
        );
        return "Unable to generate config file due to missing SERVER_URL environment variable. Please notify bot owner";
    }
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
    if (interaction.channel?.isVoiceBased() && interaction.guildId) {
        const studentId = hashStudentId(interaction.user.id);
        engine.startCoachingSession(
            studentId,
            interaction.guildId,
            interaction.channelId
        );
        const privateUrl = `${process.env.SERVER_URL}/coach/${studentId}/`;
        const instructionUrl = `${process.env.SERVER_URL}/instructions`;
        interaction.reply({
            content: `Starting...\n\nGo to ${privateUrl} to hear your private coaching tips\n\nMake sure you have set up the bot first using ${instructionUrl}`,
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content:
                "Bot must be started in voice-based channel. Click 'Open Chat' beside a voice channel and try /coachme again",
            ephemeral: true,
        });
    }
}

function handleStop(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
        content: "Ending...",
        ephemeral: true,
    });
    engine.stopCoachingSession(hashStudentId(interaction.user.id));
}

export default {
    handleConfig,
    handleCoachMe,
    handleStop,
};
