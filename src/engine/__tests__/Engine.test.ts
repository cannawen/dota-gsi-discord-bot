import Engine from "../Engine";
import Fact from "../Fact";
import FactStore from "../FactStore";
import Rule from "../Rule";
import Topic from "../Topic";

describe("Engine", () => {
    let sut: Engine;
    let db: FactStore;

    let topicOne: Topic<boolean>;
    let topicTwo: Topic<boolean>;
    let topicClosureExecuted: Topic<boolean>;
    let topicDefaultZero: Topic<number>;
    beforeEach(() => {
        sut = new Engine();
        db = new FactStore();

        topicOne = new Topic<boolean>("topicOne");
        topicTwo = new Topic<boolean>("topicTwo");
        topicClosureExecuted = new Topic<boolean>("topicClosureExecuted");
        topicDefaultZero = new Topic<number>("topicDefaultZero", 0);
    });

    describe("all topics are defined", () => {
        test("executes rule", () => {
            sut.register(
                new Rule({
                    label: "rule",
                    trigger: [topicOne, topicTwo],
                    then: (_) => new Fact(topicClosureExecuted, true),
                })
            );
            expect(Engine.get(db, topicClosureExecuted)).toBeUndefined();
            sut.set(db, new Fact(topicOne, true));
            expect(Engine.get(db, topicClosureExecuted)).toBeUndefined();
            sut.set(db, new Fact(topicTwo, false));

            expect(Engine.get(db, topicClosureExecuted)).toBe(true);
        });
    });

    describe("topic does not change", () => {
        test("does not execute rule", () => {
            sut.set(db, new Fact(topicOne, true));

            sut.register(
                new Rule({
                    label: "rule",
                    trigger: [topicOne],
                    then: (_) => new Fact(topicClosureExecuted, true),
                })
            );
            sut.set(db, new Fact(topicOne, true));
            expect(Engine.get(db, topicClosureExecuted)).toBeUndefined();
        });
    });

    describe("when", () => {
        test("only triggers if when returns true", () => {
            sut.register(
                new Rule({
                    label: "rule",
                    trigger: [topicOne],
                    when: ([one]) => one,
                    then: (_) => new Fact(topicClosureExecuted, true),
                })
            );
            sut.set(db, new Fact(topicOne, false));
            expect(Engine.get(db, topicClosureExecuted)).toBeUndefined();
            sut.set(db, new Fact(topicOne, true));
            expect(Engine.get(db, topicClosureExecuted)).toBe(true);
        });
    });

    describe("default values", () => {
        test("if we write default value, make sure it is saved into db", () => {
            expect(db.getAllFacts()).toHaveLength(0);
            sut.set(db, new Fact(topicDefaultZero, 0));
            expect(db.getAllFacts()).toHaveLength(1);
        });
    });
});
