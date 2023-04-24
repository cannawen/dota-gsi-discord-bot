import Engine from "../Engine";
import Fact from "../Fact";
import FactStore from "../FactStore";
import Rule from "../Rule";
import Topic from "../Topic";

describe("Engine", () => {
    let sut: Engine;
    let db: FactStore;

    let numberTopic: Topic<number>;
    let addOneTopic: Topic<boolean>;
    beforeEach(() => {
        sut = new Engine();
        db = new FactStore();

        numberTopic = new Topic<number>("number");
        addOneTopic = new Topic<boolean>("add one");
    });

    describe("all topics are defined", () => {
        test("executes rule", () => {
            sut.register(
                new Rule("rule", [numberTopic, addOneTopic], (get) => {
                    const number = get(numberTopic)!;
                    const addOne = get(addOneTopic)!;
                    if (addOne) {
                        // Because addOneTopic is reset first
                        // the number is only incremented once
                        return [
                            new Fact(addOneTopic, undefined),
                            new Fact(numberTopic, number + 1),
                        ];
                    }
                })
            );
            sut.set(db, new Fact(numberTopic, 0));
            sut.set(db, new Fact(addOneTopic, true));

            expect(db.get(numberTopic)).toBe(1);
            expect(db.get(addOneTopic)).toBeUndefined();
        });
    });

    describe("topic does not change", () => {
        test("does not execute rule", () => {
            sut.set(db, new Fact(numberTopic, 0));

            sut.register(
                new Rule("rule", [numberTopic], (get) => {
                    const number = get(numberTopic)!;
                    const addOne = get(addOneTopic)!;
                    if (addOne) {
                        return [
                            new Fact(addOneTopic, undefined),
                            new Fact(numberTopic, number + 1),
                        ];
                    }
                })
            );
            sut.set(db, new Fact(addOneTopic, true));

            expect(db.get(numberTopic)).toBe(0);
            expect(db.get(addOneTopic)).toBe(true);
        });
    });

    // test("register rule - add twice", () => {
    //     sut.register(
    //         new Rule("rule", [numberTopic, addOneTopic], (get) => {
    //             const number = get(numberTopic)!;
    //             const addOne = get(addOneTopic)!;
    //             if (addOne) {
    //                 // Because numberTopic is returned first
    //                 // addOneTopic is still true but we are doing depth first changes
    //                 // so it will lead to an infinite loop
    //                 // TODO: Is this weird behaviour the return order of facts matters?
    //                 return [
    //                     new Fact(numberTopic, number + 1),
    //                     new Fact(addOneTopic, undefined),
    //                 ];
    //             }
    //         })
    //     );
    //     sut.setPublic(db, new Fact(numberTopic, 0));
    //     sut.setPublic(db, new Fact(addOneTopic, true));

    //     expect(db.get(numberTopic)).toBe(2);
    //     expect(db.get(addOneTopic)).toBeUndefined();
    // });
});
