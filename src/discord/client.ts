import Discord, { Events } from "discord.js";
import handle from "./handleSlashCommands";
import log from "../log";
import SlashCommandName from "./SlashCommandName";

const botSecretKey = process.env.DISCORD_BOT_TOKEN;

const discordClient = new Discord.Client({
    // eslint-disable-next-line no-magic-numbers
    intents: [131071],
});

discordClient.login(botSecretKey).catch((e: Discord.DiscordjsError) => {
    log.error(
        "discord",
        "Error logging into Discord. Check your .env file - %s",
        e.message
    );
});

discordClient.on("ready", (client) => {
    log.info("discord", "Discord ready with bot: %s", client.user.tag.cyan);
});

discordClient.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;

    log.info("discord", "Handling slash command interaction %s", commandName);
    switch (commandName) {
        case SlashCommandName.config:
            handle.config(interaction);
            break;
        case SlashCommandName.coachme:
            handle.coachMe(interaction);
            break;
        case SlashCommandName.stop:
            handle.stop(interaction);
            break;
        case SlashCommandName.help:
            handle.help(interaction);
            break;
        default:
            log.error(
                "discord",
                "Unable to handle interaction %s",
                commandName
            );
            interaction.reply({
                content: `Unable to handle command ${commandName}. Please try again later`,
                ephemeral: true,
            });
            break;
    }
});

export default discordClient;
