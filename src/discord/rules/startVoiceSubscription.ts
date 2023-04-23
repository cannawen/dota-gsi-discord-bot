/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import client from "../discordClient";
import colors from "@colors/colors";
import engine from "../../customEngine";
import Fact from "../../engine/Fact";
import { listenSpeechToText } from "../speechToText";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import topics from "../../topics";
import Voice = require("@discordjs/voice");

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
        .catch((reason) => {
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

export default new Rule(
    rules.discord.startVoiceSubscription,
    [topics.discordGuildId, topics.discordGuildChannelId, topics.studentId],
    (get) => {
        const guildId = get(topics.discordGuildId)!;
        const channelId = get(topics.discordGuildChannelId)!;
        const studentId = get(topics.studentId)!;

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
            listenSpeechToText(connection.receiver, userId).then(
                (transcript) => {
                    if (!transcript) return;
                    // If I am speaking, log content. If anyone else is, do not log. Because this is creepy.
                    if (userId === "169619011238232073") {
                        log.info("tts", transcript);
                    }
                    engine.updateChannelUtterance(channelId, transcript);
                }
            );
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;
            onPlayerStateChange(oldState, newState, studentId);
        });

        const subscription = connection.subscribe(player);
        return new Fact(topics.discordSubscriptionTopic, subscription);
    }
);
