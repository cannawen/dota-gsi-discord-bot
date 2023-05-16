import {
    CacheType,
    ChatInputCommandInteraction,
    GuildMember,
} from "discord.js";
import engine from "../customEngine";
import fs from "fs";
import helpers from "./discordHelpers";
import log from "../log";
import path from "path";

function studentId(interaction: ChatInputCommandInteraction<CacheType>) {
    return helpers.hashStudentId(interaction.user.id);
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
    const guildId = interaction.guildId;
    const channelId = (interaction.member as GuildMember | null)?.voice
        .channelId;

    const privateUrl = `${process.env.SERVER_URL}/coach/${studentId(
        interaction
    )}/`;
    let message = `Starting...\n\nGo to ${privateUrl} to hear your private coaching tips\n\nMake sure you have already gone through the setup instructions in /config`;
    if (
        guildId &&
        channelId &&
        helpers.numberOfPeopleConnected(guildId, channelId) === 0
    ) {
        engine.startCoachingSession(studentId(interaction), guildId, channelId);
    } else {
        engine.startCoachingSession(studentId(interaction));
        message = `${message}\n\nWARNING: You will not be receiving public discord announcements`;
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
        content: `See ${process.env.SERVER_URL}/instructions for setup instructions and links to the source code and Discord community\n\nCurrently running version ${process.env.GIT_REVISION}.`,
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
