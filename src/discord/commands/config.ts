import {
    AttachmentBuilder,
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import helpers from "../discordHelpers";
import log from "../../log";
import path from "path";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("config")
    .setDescription("How to set up the bot");

function generateConfigFileString(studentId: string) {
    const serverUrl = process.env.SERVER_URL;
    if (serverUrl) {
        return fs
            .readFileSync(
                path.join(
                    __dirname,
                    "../../../resources/configGsiTemplate.cfg"
                ),
                "utf8"
            )
            .replace(/SERVER_URL/g, serverUrl)
            .replace(/STUDENT_ID/, studentId);
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
    const configPath = path.join(
        __dirname,
        "../../../resources/gamestate_integration_dota2-coach.cfg"
    );
    fs.writeFileSync(
        configPath,
        generateConfigFileString(helpers.studentId(interaction))
    );
    interaction.reply({
        files: [new AttachmentBuilder(configPath)],
        content: `See ${process.env.SERVER_URL}/instructions for how to set up the bot, using the configuration file below`,
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
