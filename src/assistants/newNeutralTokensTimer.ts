import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralTokens
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you when new neutral tokens are spawning";

const NEUTRAL_TOKEN_SPAWN_MINUTES = [7, 17, 27, 37, 60];

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.neutralItemDigReminder,
        configTopic,
        [topics.time],
        (get, effect) => {
            const currentTime = get(topics.time)!;
            if (
                NEUTRAL_TOKEN_SPAWN_MINUTES.find(
                    (spawnMinute) => spawnMinute * 60 === currentTime
                )
            ) {
                return new Fact(effect, "New neutral tokens");
            }
        }
    )
);
