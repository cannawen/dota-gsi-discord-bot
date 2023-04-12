import engine from "./customEngine";
import Fact from "./engine/Fact";
import log from "./log";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

const enum EffectConfig {
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

export default EffectConfig;
