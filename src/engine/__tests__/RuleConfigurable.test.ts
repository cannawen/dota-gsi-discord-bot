import { EffectConfig } from "../../effectConfigManager";
import Fact from "../Fact";
import Rule from "../Rule";
import RuleDecoratorConfigurable from "../RuleDecoratorConfigurable";
import Topic from "../Topic";
import topics from "../../topics";

describe("RuleDecoratorConfigurable", () => {
    let configTopic: Topic<EffectConfig>;
    let topic: Topic<number>;
    let rule: RuleDecoratorConfigurable;

    beforeEach(() => {
        configTopic = new Topic<EffectConfig>("configTopic");
        topic = new Topic<number>("topic");
        rule = new RuleDecoratorConfigurable(
            configTopic,
            new Rule(
                "test",
                [topic],
                (get) => new Fact(topics.effect, "foo.mp3")
            )
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
        expect(results).toBeUndefined();
    });
});
