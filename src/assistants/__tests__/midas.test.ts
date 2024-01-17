import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../midas";
import rules from "../../rules";

const MIDAS_2_CHARGES = new PlayerItems(
    [new Item("item_hand_of_midas", "Hand of Midas", undefined, 2, true)],
    [],
    [],
    null,
    null
);
const MIDAS_2_CHARGES_BACKPACK = new PlayerItems(
    [],
    [new Item("item_hand_of_midas", "Hand of Midas", undefined, 2, true)],
    [],
    null,
    null
);
const MIDAS_ONE_CHARGE = new PlayerItems(
    [new Item("item_hand_of_midas", "Hand of Midas", undefined, 1, true)],
    [],
    [],
    null,
    null
);
const MIDAS_0_CHARGES_BACKPACK = new PlayerItems(
    [],
    [new Item("item_hand_of_midas", "Hand of Midas", undefined, 0, true)],
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
    customGameName: "",
    [rules.assistant.midas]: "PRIVATE",
    time: 100,
    alive: true,
    inGame: true,
    items: MIDAS_2_CHARGES,
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
                        "use midas."
                    );
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            items: MIDAS_2_CHARGES_BACKPACK,
                            time: 130,
                        },
                        fifteenSecondsAfterState
                    );
                    expect(thirtySecondsAfterState).toContainAudioEffect(
                        "use midas."
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
            describe("midas has one charge cooldown", () => {
                test("should remind about midas after 30 seconds", () => {
                    const firstSeenMidasState = getResults(rule, {
                        ...params,
                        items: MIDAS_ONE_CHARGE,
                    });
                    expect(firstSeenMidasState).not.toContainAudioEffect();
                    const fifteenSecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 115,
                            items: MIDAS_ONE_CHARGE,
                        },
                        firstSeenMidasState
                    );
                    expect(fifteenSecondsAfterState).not.toContainAudioEffect();
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            ...params,
                            time: 130,
                            items: MIDAS_0_CHARGES_BACKPACK,
                        },
                        fifteenSecondsAfterState
                    );
                    expect(thirtySecondsAfterState).toContainAudioEffect();
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
