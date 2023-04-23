import Fact from "../Fact";
import Rule from "../Rule";
import RuleDecoratorInGame from "../RuleDecoratorInGame";
import Topic from "../Topic";

describe("RuleDecoratorInGame", () => {
    let rule: RuleDecoratorInGame;
    let topic: Topic<number>;

    beforeEach(() => {
        topic = new Topic<number>("topic");
        rule = new RuleDecoratorInGame(
            new Rule("test", [topic], (get) => new Fact(topic, 5))
        );
    });

    describe("in game", () => {
        test("time not 0", () => {
            const results = getResults(rule, { inGame: true, time: 5 });
            expect(results).toContainFact("topic", 5);
        });
        test("time 0", () => {
            const results = getResults(rule, { inGame: true, time: 0 });
            expect(results).toBeUndefined();
        });
    });

    describe("not in game", () => {
        test("time not 0", () => {
            const results = getResults(rule, { inGame: false, time: 5 });
            expect(results).toBeUndefined();
        });
        test("time 0", () => {
            const results = getResults(rule, { inGame: false, time: 5 });
            expect(results).toBeUndefined();
        });
    });
});
