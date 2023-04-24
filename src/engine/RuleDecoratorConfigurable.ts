import effectConfig, { EffectConfig } from "../effectConfigManager";
import Fact from "./Fact";
import Rule from "./Rule";
import Topic from "./Topic";
import topics from "../topics";

/**
 * On output, replaces `topics.configurableEffect` fact with what is specified by `configTopic`
 * Note: When the effect changes, the `then` will be run once
 */
class RuleDecoratorConfigurable extends Rule {
    constructor(configTopic: Topic<EffectConfig>, rule: Rule) {
        super(rule.label, [...rule.given, configTopic], (get) => {
            const config = get(configTopic)!;
            const effect = effectConfig.configToEffectTopic[config];
            if (effect) {
                const result = rule.then(get);
                if (result === undefined) {
                    return;
                }
                return (Array.isArray(result) ? result : [result]).map(
                    (fact) => {
                        if (
                            fact.topic.label === topics.configurableEffect.label
                        ) {
                            return new Fact(effect, fact.value);
                        } else {
                            return fact;
                        }
                    }
                );
            }
        });
    }
}

export default RuleDecoratorConfigurable;
