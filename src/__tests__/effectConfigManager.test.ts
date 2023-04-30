import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";
import sut from "../effectConfigManager";

describe("effectConfigManager", () => {
    test("defaultConfigs", () => {
        expect(sut.defaultConfigs()).toContainEqual(
            new Fact(
                new PersistentTopic<EffectConfig>("Buyback", {
                    persistForever: true,
                    defaultValue: EffectConfig.PRIVATE,
                }),
                undefined
            )
        );
    });
});
