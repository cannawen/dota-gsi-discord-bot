import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../midas";
import rules from "../../rules";

const MIDAS_CAN_CAST = new PlayerItems(
    [new Item("item_hand_of_midas", "Hand of Midas", 0)],
    [],
    [],
    null,
    null
);
const MIDAS_CAN_CAST_BACKPACK = new PlayerItems(
    [],
    [new Item("item_hand_of_midas", "Hand of Midas", 0)],
    [],
    null,
    null
);
const MIDAS_ON_COOLDOWN = new PlayerItems(
    [new Item("item_hand_of_midas", "Hand of Midas", 10)],
    [],
    [],
    null,
    null
);
const MIDAS_ON_COOLDOWN_BACKPACK = new PlayerItems(
    [],
    [new Item("item_hand_of_midas", "Hand of Midas", 10)],
    [],
    null,
    null
);
const NO_MIDAS = new PlayerItems(
    [new Item("item", "item", 0)],
    [new Item("item", "item", 0)],
    [],
    null,
    null
);

const params = {
    [rules.assistant.midas]: "PRIVATE",
    time: 100,
    alive: true,
    inGame: true,
    items: MIDAS_CAN_CAST,
};

describe("midas assistant", () => {
    describe("alive", () => {
        describe("has midas", () => {
            describe("available to be cast", () => {
                test("should remind every 15 seconds", () => {
                    const firstSeenMidasState = getResults(rule, params) as any;
                    expect(firstSeenMidasState).not.toContainAudioEffect();
                    const fifteenSecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 115,
                        },
                        firstSeenMidasState
                    );
                    expect(fifteenSecondsAfterState).toContainAudioEffect(
                        "resources/audio/midas.mpeg"
                    );
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            items: MIDAS_CAN_CAST_BACKPACK,
                            time: 130,
                        },
                        fifteenSecondsAfterState
                    );
                    expect(thirtySecondsAfterState).toContainAudioEffect(
                        "resources/audio/midas.mpeg"
                    );
                    const thirtyOneSeconsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 131,
                        },
                        thirtySecondsAfterState
                    );
                    expect(
                        thirtyOneSeconsAfterState
                    ).not.toContainAudioEffect();
                });
            });
            describe("midas on cooldown", () => {
                test("should not remind about midas", () => {
                    const firstSeenMidasState = getResults(rule, {
                        ...params,
                        items: MIDAS_ON_COOLDOWN,
                    });
                    expect(firstSeenMidasState).not.toContainAudioEffect();
                    const fifteenSecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 115,
                            items: MIDAS_ON_COOLDOWN,
                        },
                        firstSeenMidasState
                    );
                    expect(fifteenSecondsAfterState).not.toContainAudioEffect();
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 130,
                            items: MIDAS_ON_COOLDOWN_BACKPACK,
                        },
                        fifteenSecondsAfterState
                    );
                    expect(thirtySecondsAfterState).not.toContainAudioEffect();
                });
            });
        });
    });

    describe("dead", () => {
        test("should not remind about midas", () => {
            const firstSeenMidasState = getResults(rule, {
                ...params,
                alive: false,
            });
            expect(firstSeenMidasState).not.toContainAudioEffect();
            const fifteenSecondsAfterState = getResults(
                rule,
                {
                    ...params,
                    time: 115,
                    alive: false,
                },
                firstSeenMidasState
            );
            expect(fifteenSecondsAfterState).not.toContainAudioEffect();
        });
    });

    describe("has no midas", () => {
        test("should not remind about midas", () => {
            const firstSeenMidasState = getResults(rule, {
                ...params,
                items: NO_MIDAS,
            });
            expect(firstSeenMidasState).not.toContainAudioEffect();
            const fifteenSecondsAfterState = getResults(
                rule,
                {
                    ...params,
                    items: NO_MIDAS,
                },
                firstSeenMidasState
            );
            expect(fifteenSecondsAfterState).not.toContainAudioEffect();
        });
    });
});
