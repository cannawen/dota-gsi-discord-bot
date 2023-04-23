import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../philosophersStone";
import rules from "../../rules";

const NO_PHILOSOPHERS_STONE = new PlayerItems(
    [new Item("id", "name")],
    [new Item("id", "name")],
    [],
    null,
    new Item("id", "name")
);
const HAS_PHILOSOPHERS_STONE_BACKPACK = new PlayerItems(
    [],
    [new Item("item_philosophers_stone", "Moneyball")],
    [],
    null,
    null
);
const HAS_PHILOSOPHERS_STONE_NEUTRAL = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_philosophers_stone", "Moneyball")
);

describe("philosopher's stone assistant", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                [rules.assistant.philosophersStone]: "PRIVATE",
                items: HAS_PHILOSOPHERS_STONE_BACKPACK,
                inGame: false,
                respawnSeconds: 0,
            });
            expect(results).toBeUndefined();
        });
    });

    describe("in game", () => {
        describe("has never seen philosophers stone before", () => {
            test("do nothing", () => {
                const results = getResults(rule, {
                    [rules.assistant.philosophersStone]: "PRIVATE",
                    items: NO_PHILOSOPHERS_STONE,
                    inGame: true,
                    alive: true,
                    respawnSeconds: 0,
                });
                expect(results).toBeUndefined();
            });
        });

        describe("sees a philosophers stone", () => {
            let seenPhilosophersStoneState: any;
            beforeEach(() => {
                seenPhilosophersStoneState = getResults(rule, {
                    [rules.assistant.philosophersStone]: "PRIVATE",
                    items: HAS_PHILOSOPHERS_STONE_NEUTRAL,
                    inGame: true,
                    alive: true,
                    respawnSeconds: 0,
                });
            });
            describe("when alive", () => {
                test("does nothing", () => {
                    const result = getResults(
                        rule,
                        {
                            [rules.assistant.philosophersStone]: "PRIVATE",
                            items: NO_PHILOSOPHERS_STONE,
                            inGame: true,
                            alive: true,
                            respawnSeconds: 0,
                        },
                        seenPhilosophersStoneState
                    );
                    expect(result).not.toContainTopic("playPrivateAudio");
                });
            });
            describe("when not alive and holding stone", () => {
                let deadSeenStoneBeforeState: any;
                beforeEach(() => {
                    deadSeenStoneBeforeState = getResults(
                        rule,
                        {
                            [rules.assistant.philosophersStone]: "PRIVATE",
                            items: HAS_PHILOSOPHERS_STONE_NEUTRAL,
                            inGame: true,
                            alive: false,
                            respawnSeconds: 30,
                        },
                        seenPhilosophersStoneState
                    );
                });
                test("do not remind", () => {
                    expect(deadSeenStoneBeforeState).toBeUndefined();
                });
            });
            describe("when not alive and not holding stone", () => {
                let deadSeenStoneBeforeState: any;
                beforeEach(() => {
                    deadSeenStoneBeforeState = getResults(
                        rule,
                        {
                            [rules.assistant.philosophersStone]: "PRIVATE",
                            items: NO_PHILOSOPHERS_STONE,
                            inGame: true,
                            alive: false,
                            respawnSeconds: 30,
                        },
                        seenPhilosophersStoneState
                    );
                });
                test("reminds", () => {
                    expect(deadSeenStoneBeforeState).toContainFact(
                        "playPrivateAudio",
                        "resources/audio/philosophers-stone-hold.mp3"
                    );
                });
                describe("almost respawn and holding stone", () => {
                    test("remind to return stone", () => {
                        const result = getResults(
                            rule,
                            {
                                [rules.assistant.philosophersStone]: "PRIVATE",
                                items: HAS_PHILOSOPHERS_STONE_NEUTRAL,
                                inGame: true,
                                alive: false,
                                respawnSeconds: 5,
                            },
                            [
                                seenPhilosophersStoneState,
                                ...deadSeenStoneBeforeState,
                            ]
                        );
                        expect(result).toContainFact(
                            "playPrivateAudio",
                            "resources/audio/philosophers-stone-return.mp3"
                        );
                    });
                });
            });
        });
    });
});
