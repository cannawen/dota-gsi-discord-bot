import Discord, { Events } from "discord.js";
import analytics from "../analytics/analytics";
import commands from "./commands";
import discordHelpers from "./discordHelpers";
import dotenv = require("dotenv");
import engine from "../customEngine";
import Fact from "../engine/Fact";
import log from "../log";
import topics from "../topics";

dotenv.config();

export class DiscordClient {
    private client = new Discord.Client({
        // eslint-disable-next-line no-magic-numbers
        intents: [131071],
    });

    public start() {
        this.setupInteractions();
        this.setupVoiceStatusUpdates();
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

    public findChannelUserIsIn(guildId: string, userId: string) {
        const guild = this.client.guilds.cache.find((g) => g.id === guildId);
        if (!guild) {
            log.error("discord", "Unable to find guild with id %s.", guildId);
            return;
        }

        return guild.members.cache.filter((u) => u.id === userId).last()?.voice
            .channelId;
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

            const userId = interaction.user.id;
            const studentId = discordHelpers.studentId(userId);
            if (!engine.getSession(studentId)) {
                engine.startCoachingSession(studentId);
            }
            engine.setFact(studentId, new Fact(topics.discordUserId, userId));

            const commandName = interaction.commandName;

            log.info(
                "discord",
                "Handling slash command interaction %s",
                commandName
            );

            const slashCommand = commands[commandName];
            if (slashCommand) {
                analytics.trackInteraction(interaction);
                slashCommand.execute(interaction);
            } else {
                log.error(
                    "discord",
                    "Unable to handle interaction %s",
                    commandName
                );
                interaction.reply({
                    content: `Unable to handle command ${commandName}. Please let us know you encountered this error with /feedback`,
                    ephemeral: true,
                });
            }
        });
    }

    private setupVoiceStatusUpdates() {
        this.client.on(Events.VoiceStateUpdate, (old, newVoiceStatus) => {
            if (newVoiceStatus.channelId !== null) return;

            const channelMembers = old.channel?.members;
            const bot = channelMembers?.find(
                (m) => m.id === process.env.DISCORD_APPLICATION_ID
            );
            if (channelMembers?.size === 1 && bot !== undefined) {
                engine.deleteSessionForGuild(bot.guild.id);
            }
        });
    }

    public sendFeedback(feedback: string) {
        // Production
        const channel = this.findChannel(
            "1105523616084394066",
            "1105533026710065284"
        );
        // Development
        // const channel = this.findChannel(
        //     "1076737468948304012",
        //     "1076737468948304015"
        // );
        if (channel?.isTextBased()) {
            channel?.send(feedback);
        }
    }
}

export default new DiscordClient();
