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

// TODO do we need this configDb? Can we just find what we need out of registered topics?
export const configDb = new Map<string, Topic<Config>>();

export function registerConfig(ruleName: string, topic: Topic<Config>) {
    topics.registerTopic(topic);
    configDb.set(ruleName, topic);

    engine.register(
        new Rule(
            `${ruleName}_config`,
            [topic],
            (_) => new Fact(topics.configUpdated, true)
        )
    );
}

export default Config;
