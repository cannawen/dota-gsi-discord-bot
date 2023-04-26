import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    // We have no channel so disable all of discord
    new Rule(
        "discord/enabled",
        [topics.discordGuildId, topics.discordGuildChannelId],
        (get) => {
            // guild and channel id might be set to null
            // when we are coaching without public audio
            const guildId = get(topics.discordGuildId);
            const channelId = get(topics.discordGuildChannelId);

            return [
                new Fact(
                    topics.discordAudioEnabled,
                    guildId !== null && channelId !== null
                ),
                new Fact(topics.updateFrontend, true),
            ];
        }
    ),
    // TODO add tests
    // If someone is currently speaking
    // Or audio is currently being played
    // We are "not ready" to play new audio
    new Rule(
        "discord/readyToPlayAudio",
        [
            topics.audioPlayerReady,
            topics.numberOfPeopleTalking,
            topics.discordAudioEnabled,
        ],
        (get) => {
            const discordEnabled = get(topics.discordAudioEnabled)!;
            const audioPlayerReady = get(topics.audioPlayerReady)!;
            const peopleTalking = get(topics.numberOfPeopleTalking)!;
            if (discordEnabled && audioPlayerReady && peopleTalking === 0) {
                return new Fact(topics.discordReadyToPlayAudio, true);
            } else {
                return new Fact(topics.discordReadyToPlayAudio, false);
            }
        }
    ),
];
