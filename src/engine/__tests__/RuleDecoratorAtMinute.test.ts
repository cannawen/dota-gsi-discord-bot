import topics from "../../topics";
import Fact from "../Fact";
import Rule from "../Rule";
import RuleDecoratorAtMinute from "../RuleDecoratorAtMinute";
import Topic from "../Topic";

describe("RuleDecoratorAtMinute", () => {
    let rule: RuleDecoratorAtMinute;
    let topic: Topic<boolean>;

    beforeEach(() => {
        topic = new Topic<boolean>("hasTriggeredClosure");
        rule = new RuleDecoratorAtMinute(
            10,
            new Rule("test", [topic], (get) => new Fact(topic, true))
        );
    });

    test("should subscribe to time topic", () => {
        expect(rule.given).toContain(topics.time);
        expect(rule.given).toContain(topic);
    });

    describe("in game", () => {
        test("time not 10 minutes, should not trigger closure", () => {
            expect(
                getResults(rule, {
                    inGame: true,
                    time: 10 * 60 - 1,
                })
            ).toBeUndefined();

            expect(
                getResults(rule, {
                    inGame: true,
                    time: 10 * 60 + 1,
                })
            ).toBeUndefined();
        });

        test("time 10 minutes, should trigger then closure", () => {
            expect(
                getResults(rule, { inGame: true, time: 10 * 60 })
            ).toContainFact("hasTriggeredClosure", true);
        });
    });

    describe("not in game, at proper time", () => {
        test("should not trigger then closure", () => {
            expect(
                getResults(rule, { inGame: false, time: 10 * 60 })
            ).toBeUndefined();
        });
    });
});
