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
    [new Item("item_philosophers_stone", "Philosopher's Stone")],
    [],
    null,
    null
);
const HAS_PHILOSOPHERS_STONE_NEUTRAL = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_philosophers_stone", "Philosopher's Stone")
);

const params = {
    [rules.assistant.philosophersStone]: "PRIVATE",
    items: HAS_PHILOSOPHERS_STONE_NEUTRAL,
    inGame: true,
    time: 100,
    alive: true,
    respawnSeconds: 0,
};

describe("philosophers stone assistant, in game", () => {
    describe("has never seen philosophers stone before", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                ...params,
                items: NO_PHILOSOPHERS_STONE,
            });
            expect(results).not.toContainAudioEffect();
        });
    });

    describe("sees a philosophers stone", () => {
        let seenPhilosophersStoneState: any;
        beforeEach(() => {
            seenPhilosophersStoneState = getResults(rule, params);
        });
        describe("when alive", () => {
            test("does nothing", () => {
                const result = getResults(
                    rule,
                    params,
                    seenPhilosophersStoneState
                );
                expect(result).not.toContainAudioEffect();
            });
        });
        describe("when not alive and holding stone", () => {
            let deadSeenStoneBeforeState: any;
            beforeEach(() => {
                deadSeenStoneBeforeState = getResults(
                    rule,
                    {
                        ...params,
                        alive: false,
                        respawnSeconds: 30,
                    },
                    seenPhilosophersStoneState
                );
            });
            test("do not remind", () => {
                expect(deadSeenStoneBeforeState).not.toContainAudioEffect();
            });
        });
        describe("when not alive and not holding stone", () => {
            let deadSeenStoneBeforeState: any;
            beforeEach(() => {
                deadSeenStoneBeforeState = getResults(
                    rule,
                    {
                        ...params,
                        items: HAS_PHILOSOPHERS_STONE_BACKPACK,
                        alive: false,
                        respawnSeconds: 30,
                    },
                    seenPhilosophersStoneState
                );
            });
            test("reminds", () => {
                expect(deadSeenStoneBeforeState).toContainAudioEffect(
                    "you can hold the philosopher's stone"
                );
            });
            describe("almost respawn and holding stone", () => {
                describe("neutral item is appropriate for time", () => {
                    test("do not remind to return stone", () => {
                        const result = getResults(
                            rule,
                            {
                                ...params,
                                alive: false,
                                respawnSeconds: 5,
                            },
                            [
                                ...seenPhilosophersStoneState,
                                ...deadSeenStoneBeforeState,
                            ]
                        );
                        expect(result).not.toContainAudioEffect();
                    });
                });
                describe("neutral item is not appropriate for time", () => {
                    test("remind to return stone", () => {
                        const result = getResults(
                            rule,
                            {
                                ...params,
                                time: 60 * 60,
                                alive: false,
                                respawnSeconds: 5,
                            },
                            [
                                ...seenPhilosophersStoneState,
                                ...deadSeenStoneBeforeState,
                            ]
                        );
                        expect(result).toContainAudioEffect(
                            "you can return the philosopher's stone"
                        );
                    });
                });
            });
        });
    });
});
