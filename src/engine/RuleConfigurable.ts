import Config, { configToEffectTopic } from "../configTopics";
import Fact from "./Fact";
import log from "../log";
import Rule from "./Rule";
import Topic from "./Topic";

class RuleConfigurable extends Rule {
    constructor(
        label: string,
        configTopic: Topic<Config>,
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
            } else {
                log.error("rules", "No effect found for %s", configTopic.label);
            }
        });
    }
}

export default RuleConfigurable;
