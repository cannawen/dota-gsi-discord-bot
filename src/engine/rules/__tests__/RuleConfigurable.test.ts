import { EffectConfig } from "../../../effectConfigManager";
import Fact from "../../Fact";
import Rule from "../../Rule";
import RuleDecoratorConfigurable from "../RuleDecoratorConfigurable";
import Topic from "../../Topic";
import topics from "../../../topics";

describe("RuleDecoratorConfigurable", () => {
    let configTopic: Topic<EffectConfig>;
    let rule: RuleDecoratorConfigurable;

    beforeEach(() => {
        configTopic = new Topic<EffectConfig>("configTopic");
        rule = new RuleDecoratorConfigurable(
            configTopic,
            new Rule({
                label: "test",
                trigger: [configTopic],
                then: () => new Fact(topics.configurableEffect, "foo.mp3"),
            })
        );
    });
    test("PRIVATE", () => {
        const results = getResults(rule, { configTopic: EffectConfig.PRIVATE });
        expect(results).toContainFact("playPrivateAudio", "foo.mp3");
    });
    test("PUBLIC", () => {
        const results = getResults(rule, { configTopic: EffectConfig.PUBLIC });
        expect(results).toContainFact("playPublicAudio", "foo.mp3");
    });
    test("PUBLIC_INTERRUPTING", () => {
        const results = getResults(rule, {
            configTopic: EffectConfig.PUBLIC_INTERRUPTING,
        });
        expect(results).toContainFact("playInterruptingAudioFile", "foo.mp3");
    });
    test("NONE", () => {
        const results = getResults(rule, { configTopic: EffectConfig.NONE });
        expect(results).not.toContainTopic("playPrivateAudio");
        expect(results).not.toContainTopic("playPublicAudio");
        expect(results).not.toContainTopic("playInterruptingAudioFile");
        expect(results).toHaveLength(1);
        expect(results).toContainFact("configTopic", EffectConfig.NONE);
    });
});
