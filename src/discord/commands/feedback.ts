import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import discordClient from "../discordClient";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("feedback")
    .addStringOption((option) =>
        option
            .setName("thoughts")
            .setDescription("Let us know what you think of the bot!")
            .setRequired(true)
    )
    .setDescription(
        "Provide anonymous feedback (posted publicly to the bot's discord channel)"
    );

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const userFeedback = interaction.options.getString("thoughts");
    discordClient.sendFeedback(
        `Anonymous user: ${userFeedback}\nBot version: ${process.env.GIT_REVISION}`
    );
    interaction.reply({
        content: `Anonymous feedback has been sent. Check the discord to see a response! https://discord.gg/wQkkMJf7Aj`,
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
