/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import client from "../discordClient";
import colors from "@colors/colors";
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import stt from "../speechToText";
import topics from "../../topics";
import Voice = require("@discordjs/voice");
import analytics from "../../analytics/analytics";

const emColor = colors.cyan;

// https://discordjs.guide/voice/voice-connections.html#handling-disconnects
function onConnectionDisconnected(
    studentId: string,
    connection: Voice.VoiceConnection
) {
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
            // TODO: Need to figure out how to find the guild and channel id from here
            // So we can update our db with new channel id
            // The voice subscription is automagically updated.
        })
        .catch((_) => {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            engine.setFact(studentId, new Fact(topics.discordGuildId, null));
            engine.setFact(
                studentId,
                new Fact(topics.discordGuildChannelId, null)
            );
            connection.destroy();
        });
}

function onConnectionStateChange(
    oldState: Voice.VoiceConnectionState,
    newState: Voice.VoiceConnectionState,
    studentId: string,
    connection: Voice.VoiceConnection
) {
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
            return onConnectionDisconnected(studentId, connection);
        default:
            break;
    }
}

function onPlayerStateChange(
    oldState: Voice.AudioPlayerState,
    newState: Voice.AudioPlayerState,
    studentId: string
) {
    log.debug(
        "discord",
        "AudioPlayerState - transitioned from %s to %s for student",
        oldState.status,
        emColor(newState.status),
        studentId.substring(0, 10)
    );

    const ready = newState.status === Voice.AudioPlayerStatus.Idle;
    engine.setFact(studentId, new Fact(topics.discordReadyToPlayAudio, ready));
}

export default new Rule({
    label: rules.discord.startVoiceSubscription,
    trigger: [
        topics.discordGuildId,
        topics.discordGuildChannelId,
        topics.studentId,
    ],
    then: ([guildId, channelId, studentId]) => {
        if (guildId === null || channelId === null) {
            return;
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
        analytics.trackDiscordConnectionInfo(studentId, channel);

        const connection = Voice.joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channelId,
            guildId: guildId,
            selfDeaf: false,
            selfMute: false,
        });
        connection.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;
            // This is a bit weird we are only returning the promise here for our tests
            return onConnectionStateChange(
                oldState,
                newState,
                studentId,
                connection
            );
        });

        connection.receiver.speaking.on("start", (userId) => {
            const sttEnabled = engine.getFactValue(
                studentId,
                topics.discordVoiceRecognitionPermissionGranted
            );
            if (sttEnabled) {
                stt.transcribe(connection.receiver, userId)
                    .then((utterance) => {
                        if (!utterance) return;
                        // If I am speaking, log content. If anyone else is, do not log. Because this is creepy.
                        if (userId === "169619011238232073") {
                            log.info("tts", utterance);
                        }
                        engine.setFact(
                            studentId,
                            new Fact(topics.lastDiscordUtterance, utterance)
                        );
                    })
                    .catch((error) => {
                        log.verbose(
                            "tts",
                            "Problem with transcription, %s",
                            error.message
                        );
                    });
            }
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;
            onPlayerStateChange(oldState, newState, studentId);
        });

        const subscription = connection.subscribe(player);
        return new Fact(topics.discordSubscriptionTopic, subscription);
    },
});
