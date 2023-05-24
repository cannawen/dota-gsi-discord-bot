import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import discordClient from "../discordClient";

const data = new SlashCommandBuilder()
    .setName("feedback")
    .addStringOption((option) =>
        option
            .setName("thoughts")
            .setDescription("Let us know what you think of the bot!")
            .setRequired(true)
    )
    .setDescription("Provide anonymous feedback on the bot");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const userFeedback = interaction.options.getString("thoughts");
    discordClient.sendFeedback(`Anonymous user: ${userFeedback}`);
    interaction.reply({
        content: `Anonymous feedback has been sent. Join the conversation to see a response! https://discord.gg/wQkkMJf7Aj`,
        ephemeral: true,
    });
}

export default {
    data,
    execute,
};
