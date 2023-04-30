import effectConfig, { EffectConfig } from "../../effectConfigManager";
import Fact from "../Fact";
import Rule from "../Rule";
import Topic from "../Topic";
import topics from "../../topics";

/**
 * This allows a rule to be configurable by the user to play public, private, or no audio.
 *
 * On returning facts, replaces `topics.configurableEffect` fact with effect specified by `configTopic`
 */
export default function configurable(
    configTopic: Topic<EffectConfig>,
    rule: Rule
) {
    return new Rule({
        label: rule.label,
        trigger: rule.trigger,
        given: [configTopic, ...rule.given],
        when: (trigger, given) => {
            const config = given.shift();
            if (config === EffectConfig.NONE) {
                return false;
            }
            return rule.when(trigger, given);
        },
        then: (trigger, given) => {
            const config: EffectConfig = given.shift();
            const effect = effectConfig.configToEffectTopic[config];
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
        defaultValues: rule.defaultValues,
    });
}
