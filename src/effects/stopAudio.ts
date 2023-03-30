import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.stopAudio,
    [topics.effect.stopAudio, topics.discord.discordSubscriptionTopic],
    (get) => {
        const stop = get(topics.effect.stopAudio)!;
        const subscription = get(topics.discord.discordSubscriptionTopic)!;

        if (stop) {
            subscription.player.stop();
        }
        return new Fact(topics.effect.stopAudio, undefined);
    }
);
