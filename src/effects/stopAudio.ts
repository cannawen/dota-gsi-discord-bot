import Fact from "../engine/Fact";
import log from "../log";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.effect.stopAudio,
    trigger: [topics.stopAudio, topics.discordSubscriptionTopic],
    then: ([stop, subscription]) => {
        if (stop) {
            log.info("discord", "Stop playing audio");
            subscription.player.stop();
        }
        return new Fact(topics.stopAudio, undefined);
    },
});
