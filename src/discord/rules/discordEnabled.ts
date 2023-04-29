import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    // We have no channel so disable all of discord
    new Rule({
        label: "discord/enabled",
        trigger: [topics.discordGuildId, topics.discordGuildChannelId],
        then: ([guildId, channelId]) => [
            new Fact(
                topics.discordAudioEnabled,
                guildId !== null && channelId !== null
            ),
            new Fact(topics.updateFrontend, true),
        ],
    }),
    // TODO add tests
    // If someone is currently speaking
    // Or audio is currently being played
    // We are "not ready" to play new audio
    new Rule({
        label: "discord/readyToPlayAudio",
        trigger: [
            topics.audioPlayerReady,
            topics.numberOfPeopleTalking,
            topics.discordAudioEnabled,
        ],
        then: ([audioPlayerReady, peopleTalking, discordEnabled]) => {
            if (discordEnabled && audioPlayerReady && peopleTalking === 0) {
                return new Fact(topics.discordReadyToPlayAudio, true);
            } else {
                return new Fact(topics.discordReadyToPlayAudio, false);
            }
        },
    }),
];
