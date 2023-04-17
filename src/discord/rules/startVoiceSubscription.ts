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

        connection.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;

            log.info(
                "discord",
                "connectionState changed from %s to %s for student %s",
                oldState.status,
                emColor(newState.status),
                studentId
            );

            const facts: Fact<unknown>[] = [];
            switch (newState.status) {
                case Voice.VoiceConnectionStatus.Ready:
                    facts.push(new Fact(topics.discordReadyToPlayAudio, true));
                    break;
                case Voice.VoiceConnectionStatus.Disconnected:
                    facts.push(new Fact(topics.discordGuildId, null));
                    facts.push(new Fact(topics.discordGuildChannelId, null));
                    connection.destroy();
                    break;
                default:
                    break;
            }
            facts.forEach((fact) => engine.setFact(studentId, fact));
        });

        const player = Voice.createAudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status === newState.status) return;

            log.debug(
                "discord",
                "AudioPlayerState - transitioned from %s to %s for student",
                oldState.status,
                emColor(newState.status),
                studentId
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
