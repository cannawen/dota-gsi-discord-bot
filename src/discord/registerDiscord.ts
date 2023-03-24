import colors from "@colors/colors";
import Discord from "discord.js";
import engine from "../customEngine";
import { Fact } from "../Engine";
import log from "../log";
import topic from "../topic";
import topicDiscord from "./topicDiscord";

const emColor = colors.cyan;

engine.register(
    "discord/register_bot_secret",
    [topic.discordBotSecret],
    (get) =>
        new Promise((resolve, reject) => {
            const discordClient = new Discord.Client({
                // eslint-disable-next-line no-magic-numbers
                intents: [131071],
            });

            discordClient
                .login(get(topic.discordBotSecret)!)
                .catch((e: Discord.DiscordjsError) => {
                    log.error(
                        "discord",
                        "Error logging into Discord. Check your .env file - %s",
                        e.message
                    );
                    reject(e);
                });

            discordClient.on("ready", (client) => {
                log.info(
                    "discord",
                    "Discord ready with user: %s",
                    emColor(client.user.tag)
                );
                resolve(new Fact(topicDiscord.client, client));
            });
        })
);

engine.register(
    "discord/guild",
    [topicDiscord.client, topic.discordGuildId],
    (get) => {
        const client = get(topicDiscord.client)!;
        const guildId = get(topic.discordGuildId)!;

        const guild = client.guilds.cache.find((g) => g.id === guildId);
        if (!guild) {
            log.error(
                "discord",
                "Unable to find guild with id %s. Check your .env file",
                guildId
            );
            return;
        }

        log.info(
            "discord",
            "Discord ready with guild: %s",
            emColor(guild.name)
        );

        return new Fact(topicDiscord.guild, guild);
    }
);

engine.register(
    "discord/guild_channel",
    [topicDiscord.guild, topic.discordGuildChannelId],
    (get) => {
        const guild = get(topicDiscord.guild)!;
        const channelId = get(topic.discordGuildChannelId)!;

        const channel = guild.channels.cache.find((c) => c.id === channelId);
        if (!channel) {
            log.error(
                "discord",
                "Unable to find channel with id %s. Check your .env file",
                channelId
            );
            return;
        }

        log.info(
            "discord",
            "Discord ready with channel: %s",
            emColor(channel.name)
        );

        return new Fact(topicDiscord.channel, channel);
    }
);
