import engine from "./customEngine";
import Fact from "./engine/Fact";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

enum Config {
    PUBLIC = "PUBLIC",
    PUBLIC_INTERRUPTING = "PUBLIC_INTERRUPTING",
    PRIVATE = "PRIVATE",
    NONE = "NONE",
}

export const configToEffectTopic = {
    [Config.PUBLIC]: topics.playPublicAudioFile,
    [Config.PUBLIC_INTERRUPTING]: topics.playInterruptingAudioFile,
    [Config.PRIVATE]: topics.playPrivateAudioFile,
    [Config.NONE]: undefined,
};

export function registerConfigRule(ruleName: string, topic: Topic<Config>) {
    engine.register(
        new Rule(
            `${ruleName}_config`,
            [topic],
            (_) => new Fact(topics.configUpdated, true)
        )
    );
}

export default Config;
