import engine from "./customEngine";
import Fact from "./engine/Fact";
import fs from "fs";
import log from "./log";
import path from "path";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

export const enum EffectConfig {
    PUBLIC = "PUBLIC",
    PUBLIC_INTERRUPTING = "PUBLIC_INTERRUPTING",
    PRIVATE = "PRIVATE",
    NONE = "NONE",
}

export const configToEffectTopic = {
    [EffectConfig.PUBLIC]: topics.playPublicAudioFile,
    [EffectConfig.PUBLIC_INTERRUPTING]: topics.playInterruptingAudioFile,
    [EffectConfig.PRIVATE]: topics.playPrivateAudioFile,
    [EffectConfig.NONE]: undefined,
};

export function registerEffectConfigRule(
    ruleName: string,
    topic: Topic<EffectConfig>
) {
    engine.register(
        new Rule(
            `${ruleName}_effect_config`,
            [topic],
            (_) => new Fact(topics.configUpdated, true)
        )
    );
}

export function effectFromString(effect: string) {
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

export function defaultConfigs(): Fact<EffectConfig>[] {
    const dirPath = path.join(__dirname, "assistants");

    return (
        fs
            .readdirSync(dirPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(dirPath, file))
            // eslint-disable-next-line global-require
            .map((filePath) => require(filePath))
            .reduce((memo, module) => {
                const topic = module.configTopic as Topic<EffectConfig>;
                const config = module.defaultConfig as EffectConfig;
                memo.push(new Fact(topic, config));
                return memo;
            }, [])
    );
}
