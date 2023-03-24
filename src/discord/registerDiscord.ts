import { Fact, Topic } from "../Engine";
import Discord = require("discord.js");
import engine from "../customEngine";
import log from "../log";
import topics from "../topics";

const discordClientTopic = new Topic<Discord.Client<true>>("discordClient");

engine.register(
    "discord/register_bot_secret",
    [topics.registerDiscordBotSecret],
    (get) =>
        new Promise((resolve, reject) => {
            const discordClient = new Discord.Client({
                // eslint-disable-next-line no-magic-numbers
                intents: [131071],
            });

            discordClient
                .login(get(topics.registerDiscordBotSecret)!)
                .catch((e: Discord.DiscordjsError) => {
                    log.error(
                        "discord",
                        "Error logging into Discord. Check your .env file - %s",
                        e.message
                    );
                    reject(e);
                });

            discordClient.on("ready", (client) => {
                resolve(new Fact(discordClientTopic, client));
            });
        })
);
