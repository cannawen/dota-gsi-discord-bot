import EffectConfig from "../effects/EffectConfig";

const effectConfig = {
    defaultConfigs: jest.fn().mockReturnValue([]),
    defaultConfigInfo: [],
    effectFromString: (input: string): EffectConfig => input as EffectConfig,
};
export default effectConfig;
