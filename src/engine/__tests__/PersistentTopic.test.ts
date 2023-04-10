import PersistentTopic from "../PersistentTopic";

describe("PersistentTopic", () => {
    test("persistAcrossRestarts", () => {
        const topic = new PersistentTopic("a", { persistAcrossRestarts: true });
        expect(topic.persistAcrossRestarts).toBeTruthy();
        expect(topic.persistAcrossGames).toBeFalsy();
        expect(topic.persistForever).toBeFalsy();
    });
    test("persistAcrossGames", () => {
        const topic = new PersistentTopic("a", { persistAcrossGames: true });
        expect(topic.persistAcrossRestarts).toBeFalsy();
        expect(topic.persistAcrossGames).toBeTruthy();
        expect(topic.persistForever).toBeFalsy();
    });
    test("persistForever", () => {
        const topic = new PersistentTopic("a", { persistForever: true });
        expect(topic.persistAcrossRestarts).toBeTruthy();
        expect(topic.persistAcrossGames).toBeTruthy();
        expect(topic.persistForever).toBeTruthy();
    });
});
