import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import log from "../log";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralItems
);
export const defaultConfig = EffectConfig.PUBLIC;

const NEUTRAL_ITEM_SPAWN_MINUTES = [7, 17, 27, 37, 60];

export default new RuleConfigurable(
    rules.assistant.neutralItemDigReminder,
    configTopic,
    [topics.time],
    (get, effect) => {
        const currentTime = get(topics.time)!;
        if (
            NEUTRAL_ITEM_SPAWN_MINUTES.find(
                (spawnMinute) => spawnMinute * 60 === currentTime
            )
        ) {
            // TODO remove
            log.info(
                "rules",
                "New neutral item announcement at time %s",
                currentTime / 60
            );
            return new Fact(effect, "resources/audio/new-neutrals.mp3");
        }
    }
);
