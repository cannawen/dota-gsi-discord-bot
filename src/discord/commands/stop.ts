import {
    CacheType,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import engine from "../../customEngine";
import helpers from "../discordHelpers";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop coaching me");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (engine.getSession(helpers.studentId(interaction))) {
        engine.deleteSession(helpers.studentId(interaction));
        interaction.reply({
            content: `Goodbye! Let us know about your coaching experience with /feedback`,
            flags: MessageFlags.Ephemeral,
        });
    } else {
        interaction.reply({
            content: `You are not currently in a coaching session.`,
            flags: MessageFlags.Ephemeral,
        });
    }
}

export default new SlashCommand(data, execute);
