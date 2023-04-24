import Fact from "../Fact";
import Rule from "../Rule";
import RuleDecoratorInGame from "../RuleDecoratorInGame";
import Topic from "../Topic";
import topics from "../../topics";

describe("RuleDecoratorInGame", () => {
    let rule: RuleDecoratorInGame;
    let topic: Topic<boolean>;

    beforeEach(() => {
        topic = new Topic<boolean>("hasTriggeredClosure");
        rule = new RuleDecoratorInGame(
            new Rule("test", [topic], (get) => new Fact(topic, true))
        );
    });
    test("should subscribe to in game and time topic", () => {
        expect(rule.given).toContain(topics.time);
        expect(rule.given).toContain(topics.inGame);
        expect(rule.given).toContain(topic);
    });

    describe("in game", () => {
        test("time not 0", () => {
            const results = getResults(rule, { inGame: true, time: 5 });
            expect(results).toContainFact("hasTriggeredClosure", true);
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
