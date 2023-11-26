import EffectConfig from "../../effects/EffectConfig";
import Fact from "../Fact";
import Rule from "../Rule";
import topicManager from "../topicManager";
import topics from "../../topics";

const configToEffectTopic = {
    [EffectConfig.PUBLIC]: topics.playPublicAudio,
    [EffectConfig.PUBLIC_INTERRUPTING]: topics.playInterruptingAudioFile,
    [EffectConfig.PRIVATE]: topics.playPrivateAudio,
    [EffectConfig.NONE]: undefined,
};

/**
 * This allows a rule to be configurable by the user to play public, private, or no audio.
 *
 * On returning facts, replaces `topics.configurableEffect` fact with effect specified by `configTopic`
 */
export default function configurable(configTopicString: string, rule: Rule) {
    const configTopic = topicManager.findTopic(configTopicString);
    return new Rule({
        label: rule.label,
        trigger: rule.trigger,
        given: [configTopic, ...rule.given],
        when: (trigger, g) => {
            const given = [...g];
            const config = given.shift();
            if (config === EffectConfig.NONE) {
                return false;
            }
            return rule.when(trigger, given);
        },
        then: (trigger, g) => {
            const given = [...g];
            const config: EffectConfig = given.shift();
            const effect = configToEffectTopic[config];
            if (effect) {
                const result = rule.thenArray(trigger, given);
                return result.map((fact) => {
                    if (fact.topic.label === topics.configurableEffect.label) {
                        return new Fact(effect, fact.value);
                    } else {
                        return fact;
                    }
                });
            }
        },
    });
}
