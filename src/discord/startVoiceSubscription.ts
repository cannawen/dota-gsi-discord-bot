/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import client from "./client";
import colors from "@colors/colors";
import engine from "../customEngine";
import Fact from "../classes/engine/Fact";
import log from "../log";
import Rule from "../classes/engine/Rule";
import topic from "../topic";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;

engine.register(
    new Rule(
        "discord/guild",
        [topic.discordGuildId, topic.discordGuildChannelId, topic.studentId],
        (get) => {
            const guildId = get(topic.discordGuildId)!;
            const channelId = get(topic.discordGuildChannelId)!;
            const studentId = get(topic.studentId)!;

            const guild = client.guilds.cache.find((g) => g.id === guildId);
            if (!guild) {
                log.error(
                    "discord",
                    "Unable to find guild with id %s.",
                    guildId
                );
                return;
            }

            const channel = guild.channels.cache.find(
                (c) => c.id === channelId
            );
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
                "Discord ready with guild: %s channel: %s",
                emColor(guild.name),
                emColor(channel.name)
            );

            const connection = Voice.joinVoiceChannel({
                adapterCreator: channel.guild.voiceAdapterCreator,
                channelId: channel.id,
                guildId: channel.guild.id,
            });

            connection.on(Voice.VoiceConnectionStatus.Ready, () => {
                log.info(
                    "discord",
                    "VoiceConnection ready to play audio for student %s!".green,
                    studentId
                );
                engine.readyToPlayAudio(studentId, true);
            });

            connection.on(Voice.VoiceConnectionStatus.Destroyed, () => {
                log.info(
                    "discord",
                    "VoiceConnection destroyed for student %s",
                    emColor(studentId)
                );
                engine.lostVoiceConnection(studentId);
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
                    engine.readyToPlayAudio(studentId, true);
                } else {
                    engine.readyToPlayAudio(studentId, false);
                }
            });

            const subscription = connection.subscribe(player);

            return [
                new Fact(topic.discordReadyToPlayAudio, false),
                new Fact(topic.discordSubscriptionTopic, subscription),
            ];
        }
    )
);
