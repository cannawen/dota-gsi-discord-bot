import effectConfig, { EffectConfig } from "../effectConfigManager";
import Fact from "./Fact";
import Rule from "./Rule";
import Topic from "./Topic";
import topics from "../topics";

/**
 * Note: When the effect changes, the `then` will be run once
 */
// TODO we change this to a decorator by creating a "topics.effect"
// And then this decorator swpas out the topics.effect to a get(configTopic)
// version of the effect
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
                let arrResult = result;
                if (!Array.isArray(result)) {
                    arrResult = [result];
                }
                return (arrResult as Fact<unknown>[]).map((fact) => {
                    if (fact.topic.label === topics.effect.label) {
                        return new Fact(effect, fact.value);
                    } else {
                        return fact;
                    }
                });
            }
        });
    }
}

export default RuleDecoratorConfigurable;
