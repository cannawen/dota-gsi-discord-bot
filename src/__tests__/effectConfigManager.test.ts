import sut, { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";

describe("effectConfigManager", () => {
    test("defaultConfigs", () => {
        expect(sut.defaultConfigs()).toContainEqual(
            new Fact(
                new PersistentTopic<EffectConfig>("buyback", {
                    persistForever: true,
                }),
                EffectConfig.PRIVATE
            )
        );
    });
});
