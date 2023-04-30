import Fact from "../Fact";
import FactStore from "../FactStore";
import Topic from "../Topic";

describe("FactStore", () => {
    let sut: FactStore;
    let topic: Topic<number>;
    beforeEach(() => {
        sut = new FactStore();
        topic = new Topic<number>("topic");
    });
    describe("saving fact", () => {
        test("should be able to retrieve it later", () => {
            sut.set(new Fact(topic, 5));
            expect(sut.get(topic)).toBe(5);
        });
    });
    describe("deleting fact", () => {
        test("should not be able to retrieve it later", () => {
            sut.set(new Fact(topic, 5));
            sut.set(new Fact(topic, undefined));
            expect(sut.get(topic)).toBe(undefined);
        });
    });

    describe("topic not in db", () => {
        describe("topic does not have a default value", () => {
            test("returns undefined", () => {
                expect(sut.get(topic)).toBeUndefined();
            });
        });
        describe("topic has a default value", () => {
            test("returns undefined", () => {
                const topicDefaultZero = new Topic<number>(
                    "topicDefaultZero",
                    0
                );
                expect(sut.get(topicDefaultZero)).toBeUndefined();
            });
        });
    });
});
