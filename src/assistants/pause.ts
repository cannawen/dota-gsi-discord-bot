import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/rules/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.pause
);
export const defaultConfig = EffectConfig.PUBLIC_INTERRUPTING;
export const assistantDescription = "Plays Jeopardy music while paused";

export default new RuleDecoratorConfigurable(
    configTopic,
    new RuleDecoratorInGame(
        new Rule({
            label: rules.assistant.pause,
            trigger: [topics.paused],
            then: ([paused]) => {
                if (paused) {
                    return new Fact(
                        topics.configurableEffect,
                        "resources/audio/jeopardy.mp3"
                    );
                } else {
                    return new Fact(topics.stopAudio, true);
                }
            },
        })
    )
);
