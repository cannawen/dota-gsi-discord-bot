import { CacheType, ChatInputCommandInteraction } from "discord.js";
import CryptoJS from "crypto-js";
import engine from "../customEngine";
import fs from "fs";
import helper from "./discordHelpers";
import log from "../log";
import path from "path";
import Voice = require("@discordjs/voice");
import topics from "../topics";

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
    if (interaction.channel?.isVoiceBased() && interaction.guildId) {
        engine.startCoachingSession(
            studentId(interaction),
            interaction.guildId,
            interaction.channelId
        );
        const privateUrl = `${process.env.SERVER_URL}/coach/${studentId}/`;
        interaction.reply({
            content: `Starting...\n\nGo to ${privateUrl} to hear your private coaching tips\n\nMake sure you have already gone through the setup instructions in /config`,
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

function stop(interaction: ChatInputCommandInteraction<CacheType>) {
    const guild = interaction.guild;
    if (guild) {
        const numberOFConnections = helper.numberOfPeopleConnected(
            guild.id,
            interaction.channelId
        );
        if (numberOFConnections === 0) {
            const subscription = engine.getFactValue(
                studentId(interaction),
                topics.discordSubscriptionTopic
            );
            if (subscription) {
                subscription.connection.destroy();
            } else {
                engine.deleteSession(studentId(interaction));
            }
            interaction.reply({
                content: `Ending your coaching session...`,
                ephemeral: true,
            });
        } else {
            Voice.joinVoiceChannel({
                adapterCreator: guild.voiceAdapterCreator,
                channelId: interaction.channelId,
                guildId: guild.id,
            }).destroy();
            interaction.reply({
                content: `Ending coaching session in ${guild.name}...`,
                ephemeral: true,
            });
        }
    } else {
        interaction.reply({
            content: `There was a problem ending coaching session; no guild found`,
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
