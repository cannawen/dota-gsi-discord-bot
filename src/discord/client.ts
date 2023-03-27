import Discord, { Events } from "discord.js";
import Command from "./Command";
import handleSlashCommands from "./slashCommands";
import log from "../log";

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
    log.info("discord", "Discord ready with user: %s", client.user.tag.cyan);
});

discordClient.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    log.info(
        "discord",
        "Handling slash command interaction %s",
        interaction.commandName
    );
    switch (interaction.commandName) {
        case Command.config:
            handleSlashCommands.handleConfig(interaction);
            break;
        case Command.coachme:
            handleSlashCommands.handleCoachMe(interaction);
            break;
        case Command.stop:
            handleSlashCommands.handleStop(interaction);
            break;
        default:
            log.error(
                "discord",
                "Unable to handle interaction %s",
                interaction.commandName
            );
            break;
    }
});

export default discordClient;
