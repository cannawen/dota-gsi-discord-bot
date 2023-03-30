import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import Voice = require("@discordjs/voice");

export default new Rule(
    rules.effect.playInterruptingAudio,
    [topics.playInterruptingAudioFile, topics.discordSubscriptionTopic],
    (get) => {
        const file = get(topics.playInterruptingAudioFile)!;
        const subscription = get(topics.discordSubscriptionTopic)!;

        subscription.player.play(Voice.createAudioResource(file));
        return new Fact(topics.playInterruptingAudioFile, undefined);
    }
);