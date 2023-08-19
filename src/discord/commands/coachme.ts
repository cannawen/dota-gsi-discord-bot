import {
    CacheType,
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from "discord.js";
import engine from "../../customEngine";
import helpers from "../discordHelpers";
import { SlashCommand } from "../SlashCommand";

const data = new SlashCommandBuilder()
    .setName("coachme")
    .setDescription("Start coaching me");

function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const guildId = interaction.guildId;
    const channelId =
        (interaction.member as GuildMember | null)?.voice.channelId ||
        (interaction.channel?.isVoiceBased()
            ? interaction.channelId
            : undefined);

    const privateUrl = `${process.env.SERVER_URL}/coach/${helpers.studentId(
        interaction
    )}/`;
    let message = `To hear your private coaching tips, go to ${privateUrl}\n\nUse the command /feedback to let us know how to improve, or join our discord community if you need any help! https://discord.gg/wQkkMJf7Aj`;
    if (!guildId || !channelId) {
        message = `${message}\n\nWARNING: The bot could not find a voice channel to join (but your private coaching tips will still work). Please join a voice channel and try /coachme again`;
    }
    engine.startCoachingSession(
        helpers.studentId(interaction),
        guildId || undefined,
        channelId
    );
    interaction.reply({
        content: message,
        ephemeral: true,
    });
}

export default new SlashCommand(data, execute);
