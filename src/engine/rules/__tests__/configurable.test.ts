import ConfigInfo from "../../../ConfigInfo";
import configurable from "../configurable";
import EffectConfig from "../../../effects/EffectConfig";
import Fact from "../../Fact";
import Rule from "../../Rule";
import topicManager from "../../topicManager";
import topics from "../../../topics";

let rule: Rule;

describe("configurable", () => {
    beforeEach(() => {
        const configInfo = new ConfigInfo(
            "ruleId",
            "Rule Name",
            "Rule description",
            EffectConfig.NONE
        );
        const ruleId = topicManager.createConfigTopic("ruleId");
        rule = configurable(
            configInfo,
            new Rule({
                label: "test",
                trigger: [ruleId],
                then: () => new Fact(topics.configurableEffect, "foo.mp3"),
            })
        );
    });
    test("PRIVATE", () => {
        const results = getResults(rule, { ruleId: EffectConfig.PRIVATE });
        expect(results).toContainFact("playPrivateAudio", "foo.mp3");
    });
    test("PUBLIC", () => {
        const results = getResults(rule, { ruleId: EffectConfig.PUBLIC });
        expect(results).toContainFact("playPublicAudio", "foo.mp3");
    });
    test("PUBLIC_INTERRUPTING", () => {
        const results = getResults(rule, {
            ruleId: EffectConfig.PUBLIC_INTERRUPTING,
        });
        expect(results).toContainFact("playInterruptingAudioFile", "foo.mp3");
    });
    test("NONE", () => {
        const results = getResults(rule, { ruleId: EffectConfig.NONE });
        expect(results).not.toContainTopic("playPrivateAudio");
        expect(results).not.toContainTopic("playPublicAudio");
        expect(results).not.toContainTopic("playInterruptingAudioFile");
        expect(results).toHaveLength(1);
        expect(results).toContainFact("ruleId", EffectConfig.NONE);
    });
});
