import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_RUNE_SPAWN_INTERVAL = 3 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 12:00";

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.lotus,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (
                time > 0 &&
                time <= 12 * 60 &&
                time % LOTUS_RUNE_SPAWN_INTERVAL === 0
            ) {
                return new Fact(effect, "lotus");
            }
        }
    )
);
