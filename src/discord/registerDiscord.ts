/* eslint-disable max-statements */
import { Fact, Topic } from "../Engine";
import colors from "@colors/colors";
import Discord = require("discord.js");
import engine from "../customEngine";
import log from "../log";
import topics from "../topics";
import Voice = require("@discordjs/voice");

const discordClientTopic = new Topic<Discord.Client<true>>("discordClient");
const discordGuildTopic = new Topic<Discord.Guild>("discordGuildTopic");
const discordChannelTopic = new Topic<Discord.Channel>("discordChannelTopic");

const emColor = colors.blue;

engine.register(
    "discord/register_bot_secret",
    [topics.discordBotSecret],
    (get) =>
        new Promise((resolve, reject) => {
            const discordClient = new Discord.Client({
                // eslint-disable-next-line no-magic-numbers
                intents: [131071],
            });

            discordClient
                .login(get(topics.discordBotSecret)!)
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
                resolve(new Fact(discordClientTopic, client));
            });
        })
);

engine.register(
    "discord/guild",
    [discordClientTopic, topics.discordGuildId],
    (get) => {
        const client = get(discordClientTopic)!;
        const guildId = get(topics.discordGuildId)!;

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

        return new Fact(discordGuildTopic, guild);
    }
);

engine.register(
    "discord/guild",
    [discordGuildTopic, topics.discordGuildChannelId],
    (get) => {
        const guild = get(discordGuildTopic)!;
        const channelId = get(topics.discordGuildChannelId)!;

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

        return new Fact(discordChannelTopic, channel);
    }
);
