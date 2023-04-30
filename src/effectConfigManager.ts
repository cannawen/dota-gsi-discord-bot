import EffectConfig from "./effects/EffectConfig";
import engine from "./customEngine";
import Fact from "./engine/Fact";
import fs from "fs";
import log from "./log";
import path from "path";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

function registerEffectConfigRule(
    ruleName: string,
    topic: Topic<EffectConfig>
) {
    engine.register(
        new Rule({
            label: `${ruleName}_effect_config`,
            trigger: [topic],
            then: () => new Fact(topics.updateFrontend, true),
        })
    );
}

function effectFromString(effect: string) {
    switch (effect) {
        case EffectConfig.PUBLIC:
            return EffectConfig.PUBLIC;
        case EffectConfig.PUBLIC_INTERRUPTING:
            return EffectConfig.PUBLIC_INTERRUPTING;
        case EffectConfig.PRIVATE:
            return EffectConfig.PRIVATE;
        case EffectConfig.NONE:
            return EffectConfig.NONE;
        default:
            log.error(
                "app",
                "Cannot find effect %s. Defaulting to NONE",
                effect
            );
            return EffectConfig.NONE;
    }
}

function defaultConfigs(): Fact<EffectConfig>[] {
    const dirPath = path.join(__dirname, "assistants");

    return (
        fs
            .readdirSync(dirPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(dirPath, file))
            // eslint-disable-next-line global-require
            .map((filePath) => require(filePath))
            .filter((module) => module.configTopic)
            .reduce((memo, module) => {
                const topic = module.configTopic as Topic<EffectConfig>;
                memo.push(new Fact(topic, undefined));
                return memo;
            }, [])
    );
}

export default {
    defaultConfigs,
    effectFromString,
    registerEffectConfigRule,
};
