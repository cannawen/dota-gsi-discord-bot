import { EffectConfig } from "../../effectConfigManager";
import Rule from "../Rule";
import Topic from "../Topic";

describe("Rule", () => {
    let configTopic: Topic<EffectConfig>;
    let topic: Topic<number>;
    let rule: Rule;

    beforeEach(() => {
        configTopic = new Topic<EffectConfig>("configTopic");
        topic = new Topic<number>("topic");
        rule = new Rule("test", [topic, topic, configTopic], (get) => {});
    });
    test("does not de-duplicate given topics", () => {
        expect(rule.given.length).toBe(3);
        expect(rule.given).toContain(topic);
        expect(rule.given).toContain(configTopic);
    });
});
