/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
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

        const channel = client.findChannel(guildId, channelId);
        if (!channel) {
            log.error(
                "discord",
                "Not attempting to start Voice.PlayerSubscription for %s; channel %s not found in guild %s",
                studentId,
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

        connection.on(Voice.VoiceConnectionStatus.Ready, () => {
            log.info(
                "discord",
                "VoiceConnection ready to play audio for student %s!".green,
                studentId
            );
            // Need this here to start the ready to play audio state as true
            engine.setFact(
                studentId,
                new Fact(topics.discordReadyToPlayAudio, true)
            );
        });

        connection.on(Voice.VoiceConnectionStatus.Destroyed, () => {
            log.info(
                "discord",
                "VoiceConnection destroyed for student %s",
                emColor(studentId)
            );
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
