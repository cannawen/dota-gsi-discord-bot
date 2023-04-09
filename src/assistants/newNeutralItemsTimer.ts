import EffectConfig from "../EffectConfig";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralItems
);
export const defaultConfig = EffectConfig.PUBLIC;

const NEW_NEUTRAL_ITEM_TIMES = [
    7 * 60,
    17 * 60,
    27 * 60,
    36 * 60 + 40,
    60 * 60,
];

export default new RuleConfigurable(
    rules.assistant.neutralItemDigReminder,
    configTopic,
    [topics.time],
    (get, effect) => {
        const time = get(topics.time)!;
        if (NEW_NEUTRAL_ITEM_TIMES.find((t) => t === time)) {
            return new Fact(effect, "resources/audio/new-neutrals.mp3");
        }
    }
);
