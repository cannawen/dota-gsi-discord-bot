import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import engine from "../../customEngine";
import helpers from "../discordHelpers";

const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop coaching me");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (engine.getSession(helpers.studentId(interaction))) {
        engine.deleteSession(helpers.studentId(interaction));
        interaction.reply({
            content: `Goodbye! Let us know about your coaching experience with /feedback`,
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: `You are not currently in a coaching session.`,
            ephemeral: true,
        });
    }
}

export default {
    data,
    execute,
};
