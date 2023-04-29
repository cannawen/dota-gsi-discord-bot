import effectConfig, { EffectConfig } from "../effectConfigManager";
import Fact from "./Fact";
import Rule from "./Rule";
import Topic from "./Topic";
import topics from "../topics";

/**
 * This allows a rule to be configurable by the user to play public, private, or no audio.
 *
 * On returning facts, replaces `topics.configurableEffect` fact with effect specified by `configTopic`
 */
class RuleDecoratorConfigurable extends Rule {
    // eslint-disable-next-line max-lines-per-function
    constructor(configTopic: Topic<EffectConfig>, rule: Rule) {
        super({
            label: rule.label,
            trigger: rule.trigger,
            given: rule.given,
            when: (trigger, given, get) =>
                rule.when(trigger, given, get) &&
                get(configTopic)! !== EffectConfig.NONE,
            then: (trigger, given, get) => {
                const effect =
                    effectConfig.configToEffectTopic[get(configTopic)!];
                if (effect) {
                    const result = rule.then(trigger, given, get);
                    if (result === undefined) {
                        return;
                    }
                    return (Array.isArray(result) ? result : [result]).map(
                        (fact) => {
                            if (
                                fact.topic.label ===
                                topics.configurableEffect.label
                            ) {
                                return new Fact(effect, fact.value);
                            } else {
                                return fact;
                            }
                        }
                    );
                }
            },
            defaultValues: rule.defaultValues,
        });
    }
}

export default RuleDecoratorConfigurable;
