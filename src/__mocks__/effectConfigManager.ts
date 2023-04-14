const config = {
    defaultConfigs: jest.fn().mockReturnValue([]),
    EffectConfig: {
        PUBLIC: "PUBLIC",
        PUBLIC_INTERRUPTING: "PUBLIC_INTERRUPTING",
        PRIVATE: "PRIVATE",
        NONE: "NONE",
    },
    effectFromString: (input: string) => input,
};
export default config;
