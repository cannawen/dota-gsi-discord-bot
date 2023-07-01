import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import analytics from "../../analytics/analytics";
import fs from "fs";
import helpers from "../discordHelpers";
import log from "../../log";
import path from "path";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("config")
    .setDescription("How to set up the bot");

function generateConfigFile(userId: string) {
    const serverUrl = process.env.SERVER_URL;
    if (serverUrl) {
        return fs
            .readFileSync(
                path.join(
                    __dirname,
                    "../../../resources/configInstructions.txt"
                ),
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

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const userId = interaction.user.id;
    const studentId = helpers.studentId(userId);

    analytics.track("/config", {
        distinct_id: interaction.user.id,
    });
    analytics.people.set(userId, {
        $first_name: interaction.user.username,
        studentId: studentId,
    });

    interaction.reply({
        content: generateConfigFile(studentId),
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
