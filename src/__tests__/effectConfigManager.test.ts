import sut, { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";

describe("effectConfigManager", () => {
    test("defaultConfigs", () => {
        expect(sut.defaultConfigs()).toContainEqual(
            new Fact(
                new PersistentTopic<EffectConfig>("Buyback", {
                    persistForever: true,
                }),
                EffectConfig.PRIVATE
            )
        );
    });
});
