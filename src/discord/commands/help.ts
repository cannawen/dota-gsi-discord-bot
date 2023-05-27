import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to use the bot and link to user support community");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
        content: `See ${process.env.SERVER_URL}/instructions for setup instructions and links to the source code and Discord community. Use /feedback to let us know how we can improve!\n\nCurrently running version ${process.env.GIT_REVISION}.`,
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
