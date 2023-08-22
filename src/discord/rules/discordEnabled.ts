import discordHelpers from "../discordHelpers";
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
                guildId !== null &&
                    channelId !== null &&
                    discordHelpers.numberOfPeopleConnected(guildId) === 1
            ),
            new Fact(topics.updateFrontend, true),
        ],
    }),
];
