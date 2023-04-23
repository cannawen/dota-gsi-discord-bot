import Discord, { Events } from "discord.js";
import handle from "./handleSlashCommands";
import log from "../log";
import SlashCommandName from "./SlashCommandName";

export class DiscordClient {
    private client = new Discord.Client({
        // eslint-disable-next-line no-magic-numbers
        intents: [131071],
    });

    public start() {
        this.setupInteractions();
        this.client.on(Events.Error, (error) => {
            log.error("discord", "%s", error);
        });
        return Promise.all([this.setup(), this.ready()]);
    }

    public findChannel(guildId: string, channelId: string) {
        const guild = this.client.guilds.cache.find((g) => g.id === guildId);
        if (!guild) {
            log.error("discord", "Unable to find guild with id %s.", guildId);
            return;
        }

        const channel = guild.channels.cache.find((c) => c.id === channelId);
        if (!channel) {
            log.error(
                "discord",
                "Unable to find channel with id %s in guild %s",
                channelId,
                guild.name
            );
            return;
        }

        log.info(
            "discord",
            "Found guild: %s channel: %s",
            guild.name.cyan,
            channel.name.cyan
        );
        return channel;
    }

    private setup() {
        return this.client
            .login(process.env.DISCORD_BOT_TOKEN)
            .catch((e: Discord.DiscordjsError) => {
                log.error(
                    "discord",
                    "Error logging into Discord. Check your .env file - %s",
                    e.message
                );
            });
    }

    private ready() {
        return new Promise<void>((resolve) => {
            this.client.once(Events.ClientReady, (client) => {
                resolve();
                log.info(
                    "discord",
                    "Discord ready with bot: %s",
                    client.user.tag.cyan
                );
            });
        });
    }

    private setupInteractions() {
        this.client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const commandName = interaction.commandName;

            log.info(
                "discord",
                "Handling slash command interaction %s",
                commandName
            );
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
    }
}

export default new DiscordClient();
