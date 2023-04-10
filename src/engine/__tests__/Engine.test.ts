import Engine from "../Engine";
import Fact from "../Fact";
import FactStore from "../FactStore";
import Rule from "../Rule";
import Topic from "../Topic";

class TestEngine extends Engine {
    public setPublic = (db: FactStore, newFact: Fact<unknown>) => {
        this.set(db, newFact);
    };
}

describe("Engine", () => {
    let sut: TestEngine;
    let db: FactStore;

    let numberTopic: Topic<number>;
    let addOneTopic: Topic<boolean>;
    beforeEach(() => {
        sut = new TestEngine();
        db = new FactStore();

        numberTopic = new Topic<number>("number");
        addOneTopic = new Topic<boolean>("add one");
    });
    test("register rule", () => {
        sut.register(
            new Rule("rule", [numberTopic, addOneTopic], (get) => {
                const number = get(numberTopic)!;
                const addOne = get(addOneTopic)!;
                if (addOne) {
                    return [
                        new Fact(numberTopic, number + 1),
                        new Fact(addOneTopic, undefined),
                    ];
                }
            })
        );
        sut.setPublic(db, new Fact(numberTopic, 0));
        sut.setPublic(db, new Fact(addOneTopic, true));

        expect(db.get(numberTopic)).toBe(1);
        expect(db.get(addOneTopic)).toBeUndefined();
    });
});
