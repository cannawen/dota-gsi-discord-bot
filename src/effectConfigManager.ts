import ConfigInfo from "./ConfigInfo";
import EffectConfig from "./effects/EffectConfig";
import engine from "./customEngine";
import Fact from "./engine/Fact";
import fs from "fs";
import log from "./log";
import path from "path";
import Rule from "./engine/Rule";
import topicManager from "./engine/topicManager";
import topics from "./topics";

function getDefaultConfigInfo(): ConfigInfo[] {
    const dirPath = path.join(__dirname, "assistants");
    return (
        fs
            .readdirSync(dirPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(dirPath, file))
            // eslint-disable-next-line global-require
            .map((filePath) => require(filePath))
            .filter((module) => module.configInfo)
            .map((module) => module.configInfo)
    );
}

const defaultConfigInfo = getDefaultConfigInfo();

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

let onceToken = true;

function defaultConfigFacts(): Fact<EffectConfig | undefined>[] {
    const configFacts = defaultConfigInfo.map((configInfo) => {
        const topic = topicManager.findTopic<EffectConfig>(
            configInfo.ruleIndentifier
        );
        topic.defaultValue = configInfo.defaultConfig;
        return new Fact(topic, undefined);
    });
    if (onceToken) {
        onceToken = false;
        configFacts.forEach((fact) => {
            const topic = fact.topic;
            engine.register(
                new Rule({
                    label: `update frontend when ${topic.label} config is changed`,
                    trigger: [topic],
                    then: () => new Fact(topics.updateFrontend, true),
                })
            );
        });
    }
    return configFacts;
}

export default {
    defaultConfigFacts,
    defaultConfigInfo,
    effectFromString,
};
