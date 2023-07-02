import PersistentFactStore, {
    factsToPlainObject,
    plainObjectToFacts,
} from "../PersistentFactStore";
import Fact from "../Fact";
import PersistentTopic from "../PersistentTopic";
import Topic from "../Topic";
jest.mock("../topicManager");

describe("PersistentFactStore", () => {
    let sut: PersistentFactStore;
    let facts: Fact<unknown>[];
    const regularTopic = new Topic<number>("regular");
    const persistAcrossGamesTopic = new PersistentTopic<number>(
        "persistAcrossGames",
        { persistAcrossGames: true }
    );
    const persistAcrossRestartsTopic = new PersistentTopic<number>(
        "persistAcrossRestarts",
        { persistAcrossRestarts: true }
    );
    const persistForeverTopic = new PersistentTopic<number>("persistForever", {
        persistForever: true,
    });

    beforeEach(() => {
        facts = [
            new Fact(regularTopic, 0),
            new Fact(persistAcrossGamesTopic, 1),
            new Fact(persistAcrossRestartsTopic, 2),
            new Fact(persistForeverTopic, 3),
        ];

        sut = new PersistentFactStore();
        facts.map(sut.set);
    });
    test("clearFactsToPrepareForNewGame", () => {
        sut.clearFactsToPrepareForNewGame();

        expect(sut.get(regularTopic)).toBeUndefined();
        expect(sut.get(persistAcrossGamesTopic)).toBe(1);
        expect(sut.get(persistAcrossRestartsTopic)).toBeUndefined();
        expect(sut.get(persistForeverTopic)).toBe(3);
    });

    test("getPersistentFactsAcrossRestarts", () => {
        expect(sut.getPersistentFactsAcrossRestarts()).toEqual([
            facts[2],
            facts[3],
        ]);
    });
    test("getPersistentForeverFacts", () => {
        expect(sut.getPersistentForeverFacts()).toEqual([facts[3]]);
    });

    test("factsToPlainObject", () => {
        expect(factsToPlainObject(facts)).toEqual({
            regular: 0,
            persistAcrossGames: 1,
            persistAcrossRestarts: 2,
            persistForever: 3,
        });
    });

    test("plainObjectToFacts", () => {
        expect(
            plainObjectToFacts({
                regular: 0,
                persistAcrossGames: 1,
                persistAcrossRestarts: 2,
                persistForever: 3,
            })
        ).toEqual(facts);
    });
});
