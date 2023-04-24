import effectConfig, { EffectConfig } from "../effectConfigManager";
import Fact from "./Fact";
import Rule from "./Rule";
import Topic from "./Topic";

/**
 * Note: When the effect changes, the `then` will be run once
 */
// TODO we change this to a decorator by creating a "topics.effect"
// And then this decorator swpas out the topics.effect to a get(configTopic)
// version of the effect
class RuleConfigurable extends Rule {
    constructor(
        label: string,
        configTopic: Topic<EffectConfig>,
        given: Array<Topic<unknown>>,
        then: (
            get: <T>(topic: Topic<T>) => T | undefined,
            effect: Topic<string>
        ) =>
            | Fact<unknown>
            | Promise<Fact<unknown>>
            | void
            | Array<Fact<unknown> | Promise<Fact<unknown> | void>>
    ) {
        super(label, [...given, configTopic], (get) => {
            const config = get(configTopic)!;
            const effect = effectConfig.configToEffectTopic[config];
            if (effect) {
                return then(get, effect);
            }
        });
    }
}

export default RuleConfigurable;
