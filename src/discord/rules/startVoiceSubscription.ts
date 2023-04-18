/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import client from "../discordClient";
import colors from "@colors/colors";
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import topics from "../../topics";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;

export default new Rule(
    rules.discord.startVoiceSubscription,
    [topics.discordGuildId, topics.discordGuildChannelId, topics.studentId],
    (get) => {
        const guildId = get(topics.discordGuildId)!;
        const channelId = get(topics.discordGuildChannelId)!;
        const studentId = get(topics.studentId)!;

        if (guildId === null || channelId === null) {
            log.info("discord", "No guild or channel id provided");
            const currentSubscription = engine.getFactValue(
                studentId,
                topics.discordSubscriptionTopic
            );
            if (currentSubscription) {
                log.info("discord", "Destroying existing subscription");
                currentSubscription.connection.destroy();
                engine.setFact(
                    studentId,
                    new Fact(topics.discordSubscriptionTopic, undefined)
                );
            }
        }

        const channel = client.findChannel(guildId, channelId);
        if (!channel) {
            log.error(
                "discord",
                "Not attempting to start Voice.PlayerSubscription for %s; channel %s not found in guild %s",
                studentId.substring(0, 10),
                channelId,
                guildId
            );
            return;
        }

        const connection = Voice.joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channelId,
            guildId: guildId,
        });

        connection.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;

            log.info(
                "discord",
                "connectionState changed from %s to %s for student %s",
                oldState.status,
                emColor(newState.status),
                studentId.substring(0, 10)
            );

            switch (newState.status) {
                case Voice.VoiceConnectionStatus.Ready:
                    engine.setFact(
                        studentId,
                        new Fact(topics.discordReadyToPlayAudio, true)
                    );
                    break;
                case Voice.VoiceConnectionStatus.Disconnected:
                    // This is a bit weird we are only rteurning the promise here for our tests
                    return Promise.race([
                        Voice.entersState(
                            connection,
                            Voice.VoiceConnectionStatus.Signalling,
                            5000
                        ),
                        Voice.entersState(
                            connection,
                            Voice.VoiceConnectionStatus.Connecting,
                            5000
                        ),
                    ])
                        .then(() => {
                            // Seems to be reconnecting to a new channel
                            // Need to figure out how to find the guild and channel id from here
                            // So we can update our db with new channel id
                            // The voice subscription is automagically updated.
                        })
                        .catch((reason) => {
                            // Seems to be a real disconnect which SHOULDN'T be recovered from
                            engine.setFact(
                                studentId,
                                new Fact(topics.discordGuildId, null)
                            );
                            engine.setFact(
                                studentId,
                                new Fact(topics.discordGuildChannelId, null)
                            );
                        });
                default:
                    break;
            }
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;

            log.debug(
                "discord",
                "AudioPlayerState - transitioned from %s to %s for student",
                oldState.status,
                emColor(newState.status),
                studentId.substring(0, 10)
            );

            const ready = newState.status === Voice.AudioPlayerStatus.Idle;
            engine.setFact(
                studentId,
                new Fact(topics.discordReadyToPlayAudio, ready)
            );
        });

        const subscription = connection.subscribe(player);

        return new Fact(topics.discordSubscriptionTopic, subscription);
    }
);
