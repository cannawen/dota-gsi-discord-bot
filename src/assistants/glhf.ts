import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.glhf);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Wishes you good fortune at the start of the game";

export default new RuleConfigurable(
    rules.assistant.glhf,
    configTopic,
    [topics.time],
    (get, effect) => {
        if (!get(topics.inGame)!) return;

        const time = get(topics.time)!;
        if (time === 0) {
            return new Fact(effect, "resources/audio/glhf.mp3");
        }
    }
);
