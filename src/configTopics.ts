import engine from "./customEngine";
import log from "./log";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

export enum Config {
    PUBLIC = "PUBLIC",
    PUBLIC_INTERRUPTING = "PUBLIC_INTERRUPTING",
    PRIVATE = "PRIVATE",
    NONE = "NONE",
}

export const configToEffectTopic = {
    [Config.PUBLIC]: topics.effect.playPublicAudioFile,
    [Config.PUBLIC_INTERRUPTING]: topics.effect.playInterruptingAudioFile,
    [Config.PRIVATE]: topics.effect.playPrivateAudioFile,
    [Config.NONE]: undefined,
};

const config = new Map<string, Topic<Config>>();

export function registerConfig(ruleName: string, topic: Topic<Config>) {
    config.set(ruleName, topic);
    engine.register(
        new Rule(`${ruleName}_config`, [topic], (get) => {
            log.info(
                "rules",
                "Updating %s config to %s",
                ruleName,
                get(topic)!
            );
        })
    );
}
