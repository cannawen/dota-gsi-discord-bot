import EffectConfig from "../effects/EffectConfig";

const effectConfig = {
    defaultConfigs: jest.fn().mockReturnValue([]),
    effectFromString: (input: string): EffectConfig => input as EffectConfig,
};
export default effectConfig;
