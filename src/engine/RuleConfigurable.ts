import EffectConfig, { configToEffectTopic } from "../EffectConfig";
import Fact from "./Fact";
import Rule from "./Rule";
import Topic from "./Topic";

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
            const effect = configToEffectTopic[config];
            if (effect) {
                return then(get, effect);
            }
        });
    }
}

export default RuleConfigurable;
