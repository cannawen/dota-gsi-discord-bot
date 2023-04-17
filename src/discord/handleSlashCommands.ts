import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";
import engine from "../customEngine";
import fs from "fs";
import helper from "./discordHelpers";
import log from "../log";
import path from "path";
import Voice = require("@discordjs/voice");

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

function config(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
        content: generateConfigFile(studentId(interaction)),
        ephemeral: true,
    });
}

function coachMe(interaction: ChatInputCommandInteraction<CacheType>) {
    if (engine.getSession(studentId(interaction))) {
        interaction.reply({
            content:
                "You already have a coaching session. Use /stop to end your current session before starting a new one",
            ephemeral: true,
        });
        return;
    }
    const privateUrl = `${process.env.SERVER_URL}/coach/${studentId(
        interaction
    )}/`;
    let message = `Starting...\n\nGo to ${privateUrl} to hear your private coaching tips\n\nMake sure you have already gone through the setup instructions in /config`;
    if (interaction.channel?.isVoiceBased() && interaction.guildId) {
        engine.startCoachingSession(
            studentId(interaction),
            interaction.guildId,
            interaction.channelId
        );
    } else {
        engine.startCoachingSession(studentId(interaction));
        message = `${message}\n\nWARNING: You will not be receiving public discord announcements because you did not start the coaching session in a voice based guild channel. Please type /stop and /coachme in the proper channel if you wish to recieve public discord announcements`;
    }
    interaction.reply({
        content: message,
        ephemeral: true,
    });
}

function stop(interaction: ChatInputCommandInteraction<CacheType>) {
    if (engine.getSession(studentId(interaction))) {
        engine.deleteSession(studentId(interaction));
        interaction.reply({
            content: `Ending your coaching session...`,
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: `You are not currently in a coaching session.`,
            ephemeral: true,
        });
    }
}

function help(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
        content: `Version ${process.env.GIT_REVISION}. See ${process.env.SERVER_URL}/instructions for setup instructions`,
        ephemeral: true,
    });
}

/**
 * These functions are used in `discord/client.ts`
 */
export default {
    coachMe,
    config,
    help,
    stop,
};
