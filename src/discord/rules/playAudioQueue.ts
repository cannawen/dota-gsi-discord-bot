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
        topics.discordReadyToPlayAudio,
        topics.publicAudioQueue,
        topics.discordSubscriptionTopic,
    ],
    (get) => {
        const ready = get(topics.discordReadyToPlayAudio)!;
        const subscription = get(topics.discordSubscriptionTopic)!;
        const audioQueue = [...get(topics.publicAudioQueue)!];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.pop()!;
            log.info("discord", "Playing %s", emColor(filePath));
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return [
                new Fact(topics.publicAudioQueue, audioQueue),
                new Fact(topics.discordReadyToPlayAudio, false),
            ];
        }
    }
);
