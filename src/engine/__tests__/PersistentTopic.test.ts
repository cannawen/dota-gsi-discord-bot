import PersistentTopic from "../PersistentTopic";

describe("PersistentTopic", () => {
    test("persistAcrossRestarts", () => {
        const topic = new PersistentTopic("a", { persistAcrossRestarts: true });
        expect(topic.persistAcrossRestarts).toBe(true);
        expect(topic.persistAcrossGames).toBe(false);
        expect(topic.persistForever).toBe(false);
    });
    test("persistAcrossGames", () => {
        const topic = new PersistentTopic("a", { persistAcrossGames: true });
        expect(topic.persistAcrossRestarts).toBe(false);
        expect(topic.persistAcrossGames).toBe(true);
        expect(topic.persistForever).toBe(false);
    });
    test("persistForever", () => {
        const topic = new PersistentTopic("a", { persistForever: true });
        expect(topic.persistAcrossRestarts).toBe(true);
        expect(topic.persistAcrossGames).toBe(true);
        expect(topic.persistForever).toBe(true);
    });
});
