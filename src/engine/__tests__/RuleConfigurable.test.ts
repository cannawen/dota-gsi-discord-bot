import { EffectConfig } from "../../effectConfigManager";
import Fact from "../Fact";
import { getResults } from "../../__tests__/helpers";
import RuleConfigurable from "../RuleConfigurable";
import Topic from "../Topic";

describe("RuleConfigurable", () => {
    let configTopic: Topic<EffectConfig>;
    let topic: Topic<number>;
    let rule: RuleConfigurable;

    beforeEach(() => {
        configTopic = new Topic<EffectConfig>("configTopic");
        topic = new Topic<number>("topic");
        rule = new RuleConfigurable(
            "test",
            configTopic,
            [topic],
            (get, effect) => new Fact(effect, "foo.mp3")
        );
    });
    test("PRIVATE", () => {
        const results = getResults(rule, { configTopic: EffectConfig.PRIVATE });
        expect(results).toContainFact("playPrivateAudioFile", "foo.mp3");
    });
    test("PUBLIC", () => {
        const results = getResults(rule, { configTopic: EffectConfig.PUBLIC });
        expect(results).toContainFact("playPublicAudioFile", "foo.mp3");
    });
    test("PUBLIC_INTERRUPTING", () => {
        const results = getResults(rule, {
            configTopic: EffectConfig.PUBLIC_INTERRUPTING,
        });
        expect(results).toContainFact("playInterruptingAudioFile", "foo.mp3");
    });
    test("NONE", () => {
        const results = getResults(rule, { configTopic: EffectConfig.NONE });
        expect(results).toBeUndefined();
    });
});
