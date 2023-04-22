import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import RuleDecoratorMinAndMaxMinute from "../engine/RuleDecoratorMixAndMaxMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_SPAWN_INTERVAL = 3 * 60;
const ADVANCED_WARNING = 10;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 15:00";

export default new RuleDecoratorMinAndMaxMinute(
    0,
    15,
    new RuleDecoratorInGame(
        new RuleConfigurable(
            rules.assistant.lotus,
            configTopic,
            [topics.time],
            (get, effect) => {
                const time = get(topics.time)!;
                if ((time + ADVANCED_WARNING) % LOTUS_SPAWN_INTERVAL === 0) {
                    return new Fact(effect, "lotus soon");
                }
            }
        )
    )
);
