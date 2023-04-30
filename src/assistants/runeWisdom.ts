import configurable from "../engine/rules/configurable";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWisdom
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription = "Reminds you of wisdom rune every 7:00";

const ADVANCED_WARNING = 30;

export default inGame(
    configurable(
        configTopic,
        new Rule({
            label: rules.assistant.runeWisdom,
            trigger: [topics.time],
            when: ([time]) => (time + ADVANCED_WARNING) % (7 * 60) === 0,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/wisdom-rune-soon.mp3"
                ),
        })
    )
);
