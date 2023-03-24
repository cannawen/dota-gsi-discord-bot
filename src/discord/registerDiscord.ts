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
const discordChannelTopic = new Topic<Discord.GuildBasedChannel>(
    "discordChannelTopic"
);
const discordSubscriptionTopic = new Topic<Voice.PlayerSubscription>(
    "discordSubscriptionTopic"
);

const emColor = colors.cyan;

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

engine.register(
    "discord/create-establish-voice-subscription",
    [discordChannelTopic],
    (get) => {
        const channel = get(discordChannelTopic)!;

        const connection = Voice.joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
        });
        connection.on(Voice.VoiceConnectionStatus.Ready, () => {
            log.info("discord", "VoiceConnection ready to play audio!".green);
            engine.readyToPlayAudio(true);
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status !== newState.status) {
                log.debug(
                    "discord",
                    "AudioPlayerState - transitioned from %s to %s",
                    oldState.status,
                    emColor(newState.status)
                );
            }
            if (newState.status === Voice.AudioPlayerStatus.Idle) {
                engine.readyToPlayAudio(true);
            } else {
                engine.readyToPlayAudio(false);
            }
        });

        return [
            new Fact(topics.discordReadyToPlayAudio, false),
            new Fact(discordSubscriptionTopic, connection.subscribe(player)),
        ];
    }
);

engine.register(
    "discord/play_next",
    [
        topics.discordReadyToPlayAudio,
        topics.discordAudioQueue,
        discordSubscriptionTopic,
    ],
    (get) => {
        const ready = get(topics.discordReadyToPlayAudio)!;
        const subscription = get(discordSubscriptionTopic)!;
        const audioQueue = [...get(topics.discordAudioQueue)!];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.pop()!;
            log.info("discord", "Playing %s", emColor(filePath));
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return [
                new Fact(topics.discordAudioQueue, audioQueue),
                new Fact(topics.discordReadyToPlayAudio, false),
            ];
        }
    }
);
