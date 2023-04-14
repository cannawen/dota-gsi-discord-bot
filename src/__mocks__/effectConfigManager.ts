export enum EffectConfig {
    PUBLIC = "PUBLIC",
    PUBLIC_INTERRUPTING = "PUBLIC_INTERRUPTING",
    PRIVATE = "PRIVATE",
    NONE = "NONE",
}
const config = {
    defaultConfigs: jest.fn().mockReturnValue([]),
    effectFromString: (input: string): EffectConfig => input as EffectConfig,
};
export default config;
