import colors from "@colors/colors";
import Fact from "../../engine/Fact";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import topics from "../../topics";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;

export default new Rule(
    rules.discord.playNext,
    [
        topics.discord.discordReadyToPlayAudio,
        topics.effect.publicAudioQueue,
        topics.discord.discordSubscriptionTopic,
    ],
    (get) => {
        const ready = get(topics.discord.discordReadyToPlayAudio)!;
        const subscription = get(topics.discord.discordSubscriptionTopic)!;
        const audioQueue = [...get(topics.effect.publicAudioQueue)!];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.pop()!;
            log.info("discord", "Playing %s", emColor(filePath));
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return [
                new Fact(topics.effect.publicAudioQueue, audioQueue),
                new Fact(topics.discord.discordReadyToPlayAudio, false),
            ];
        }
    }
);
