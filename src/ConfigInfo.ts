import EffectConfig from "./effects/EffectConfig";

export default class ConfigInfo {
    public readonly ruleIndentifier: string;
    public readonly ruleName: string;
    public readonly description: string;
    public readonly defaultConfig: EffectConfig;
    constructor(
        ruleIndentifier: string,
        ruleName: string,
        description: string,
        defaultConfig: EffectConfig
    ) {
        this.ruleIndentifier = ruleIndentifier;
        this.ruleName = ruleName;
        this.description = description;
        this.defaultConfig = defaultConfig;
    }
}
