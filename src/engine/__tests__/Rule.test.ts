import EffectConfig from "../../effects/EffectConfig";
import Rule from "../Rule";
import Topic from "../Topic";

describe("Rule", () => {
    let configTopic: Topic<EffectConfig>;
    let topic: Topic<number>;
    let rule: Rule;

    beforeEach(() => {
        configTopic = new Topic<EffectConfig>("configTopic");
        topic = new Topic<number>("topic");
        rule = new Rule({
            label: "test",
            trigger: [topic, topic, configTopic],
            then: () => {},
        });
    });
    test("does not de-duplicate given topics", () => {
        expect(rule.trigger.length).toBe(3);
        expect(rule.trigger).toContain(topic);
        expect(rule.trigger).toContain(configTopic);
    });
    // TODO test apply
});
