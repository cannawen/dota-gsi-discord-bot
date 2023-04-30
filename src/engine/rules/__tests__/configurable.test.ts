import configurable from "../configurable";
import EffectConfig from "../../../effects/EffectConfig";
import Fact from "../../Fact";
import Rule from "../../Rule";
import topicManager from "../../topicManager";
import topics from "../../../topics";

describe("configurable", () => {
    let configTopic = topicManager.createConfigTopic(
        "configTopic",
        EffectConfig.NONE
    );
    let rule: Rule;

    beforeEach(() => {
        rule = configurable(
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
