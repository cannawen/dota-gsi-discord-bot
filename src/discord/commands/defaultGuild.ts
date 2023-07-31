import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import helpers from "../discordHelpers";
import { SlashCommand } from "../SlashCommand";
import topics from "../../topics";

const data = new SlashCommandBuilder()
    .setName("autoconnectdefault")
    .setDescription("Set this guild as the deault guild to autoconnect to");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const studentId = helpers.studentId(interaction);
    if (!engine.getSession(studentId)) {
        engine.startCoachingSession(studentId);
    }
    engine.setFact(
        studentId,
        new Fact(topics.discordAutoconnectGuild, interaction.guildId)
    );
    interaction.reply({
        content: `Set ${interaction.guild?.name} to default autoconnect guild`,
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
