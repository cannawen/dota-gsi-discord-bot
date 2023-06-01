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
    .setName("voice")
    .addBooleanOption((option) =>
        option
            .setName("allow")
            .setDescription(
                "Allow or disallow the bot to send your voice to Google speech-to-text API for voice commands feature"
            )
            .setRequired(true)
    )
    .setDescription("Enable or disable voice commands");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const allowed = interaction.options.getBoolean("allow");
    const studentId = helpers.studentId(interaction);
    if (!engine.getSession(studentId)) {
        engine.startCoachingSession(studentId);
    }
    engine.setFact(
        studentId,
        new Fact(topics.discordVoiceRecognitionPermissionGranted, allowed)
    );
    interaction.reply({
        content: allowed ? "Voice commands enabled" : "Voice commands disabled",
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
