import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.stopAudio,
    [topics.stopAudio, topics.discordSubscriptionTopic],
    (get) => {
        const stop = get(topics.stopAudio)!;
        const subscription = get(topics.discordSubscriptionTopic)!;

        if (stop) {
            subscription.player.stop();
        }
        return new Fact(topics.stopAudio, undefined);
    }
);
