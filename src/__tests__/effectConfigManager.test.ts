import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";
import rules from "../rules";
import sut from "../effectConfigManager";

describe("effectConfigManager", () => {
    test("defaultConfigs", () => {
        const configs = sut.defaultConfigFacts();
        expect(configs).toContainEqual(
            new Fact(
                new PersistentTopic<EffectConfig>(rules.assistant.buyback, {
                    persistForever: true,
                    defaultValue: EffectConfig.PRIVATE,
                }),
                undefined
            )
        );
    });
});
