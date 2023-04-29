import Fact from "../Fact";
import Rule from "../Rule";
import RuleDecoratorInGame from "../RuleDecoratorInGame";
import Topic from "../Topic";
import topics from "../../topics";

describe("RuleDecoratorInGame", () => {
    let rule: RuleDecoratorInGame;
    let topic: Topic<boolean>;

    describe("inner rule does not subscribe to time topic", () => {
        beforeEach(() => {
            topic = new Topic<boolean>("hasTriggeredClosure");
            rule = new RuleDecoratorInGame(
                new Rule({ label: "test", then: () => new Fact(topic, true) })
            );
        });
        // Should not register to time or inGame topics because
        // some rules (buyback, pause) are depending on the givens not changing
        // to do their effect properly
        test("should not subscribe to in game and time topic", () => {
            expect(rule.trigger).not.toContain(topics.time);
            expect(rule.trigger).not.toContain(topics.inGame);
        });
    });

    describe("inner rule triggers on time topic", () => {
        beforeEach(() => {
            topic = new Topic<boolean>("hasTriggeredClosure");
            rule = new RuleDecoratorInGame(
                new Rule({
                    label: "test",
                    trigger: [topics.time],
                    then: () => new Fact(topic, true),
                })
            );
        });
        test("should subscribe to time topic", () => {
            expect(rule.trigger).toContain(topics.time);
            expect(rule.trigger).toHaveLength(1);
        });

        describe("in game", () => {
            test("time not 0", () => {
                const results = getResults(rule, { inGame: true, time: 5 });
                expect(results).toContainFact("hasTriggeredClosure", true);
            });
            test("time 0", () => {
                const results = getResults(rule, { inGame: true, time: 0 });
                expect(results).not.toContainTopic("hasTriggeredClosure");
            });
        });

        describe("not in game", () => {
            test("time not 0", () => {
                const results = getResults(rule, { inGame: false, time: 5 });
                expect(results).not.toContainTopic("hasTriggeredClosure");
            });
            test("time 0", () => {
                const results = getResults(rule, { inGame: false, time: 5 });
                expect(results).not.toContainTopic("hasTriggeredClosure");
            });
        });
    });
});
