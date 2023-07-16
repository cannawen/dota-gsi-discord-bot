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
    .setName("autoconnect")
    .addBooleanOption((option) =>
        option
            .setName("enabled")
            .setDescription("Enable or disable this feature")
            .setRequired(true)
    )
    .setDescription(
        "Have Dota Coach automatically connect to your last joined guild when you start a game"
    );

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const enabled = interaction.options.getBoolean("enabled") || false;
    const studentId = helpers.studentId(interaction);
    if (!engine.getSession(studentId)) {
        engine.startCoachingSession(studentId);
    }
    engine.setFact(
        studentId,
        new Fact(topics.discordAutoconnectEnabled, enabled)
    );
    interaction.reply({
        content: enabled ? "Autoconnect enabled" : "Autoconnect disabled",
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
