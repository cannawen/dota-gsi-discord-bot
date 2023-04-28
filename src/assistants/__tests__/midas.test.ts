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

describe("midas assistant", () => {
    describe("alive", () => {
        describe("has midas", () => {
            describe("available to be cast", () => {
                test("should remind every 15 seconds", () => {
                    const firstSeenMidasState = getResults(rule, {
                        [rules.assistant.midas]: "PRIVATE",
                        time: 100,
                        alive: true,
                        inGame: true,
                        items: MIDAS_CAN_CAST,
                    }) as any;
                    expect(firstSeenMidasState).not.toContainTopic(
                        "playPrivateAudio"
                    );
                    const fifteenSecondsAfterState = getResults(
                        rule,
                        {
                            [rules.assistant.midas]: "PRIVATE",
                            time: 115,
                            alive: true,
                            inGame: true,
                            items: MIDAS_CAN_CAST,
                        },
                        firstSeenMidasState
                    ) as any;
                    expect(fifteenSecondsAfterState).toContainFact(
                        "playPrivateAudio",
                        "resources/audio/midas.mpeg"
                    );
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            [rules.assistant.midas]: "PRIVATE",
                            time: 130,
                            alive: true,
                            inGame: true,
                            items: MIDAS_CAN_CAST_BACKPACK,
                        },
                        fifteenSecondsAfterState
                    ) as any;
                    expect(thirtySecondsAfterState).toContainFact(
                        "playPrivateAudio",
                        "resources/audio/midas.mpeg"
                    );
                    const thirtyOneSeconsAfterState = getResults(
                        rule,
                        {
                            [rules.assistant.midas]: "PRIVATE",
                            time: 131,
                            alive: true,
                            inGame: true,
                            items: MIDAS_CAN_CAST,
                        },
                        thirtySecondsAfterState
                    );
                    expect(thirtyOneSeconsAfterState).not.toContainTopic(
                        "playPrivateAudio"
                    );
                });
            });
            describe("midas on cooldown", () => {
                test("should not remind about midas", () => {
                    const firstSeenMidasState = getResults(rule, {
                        [rules.assistant.midas]: "PRIVATE",
                        time: 100,
                        alive: true,
                        inGame: true,
                        items: MIDAS_ON_COOLDOWN,
                    }) as any;
                    expect(firstSeenMidasState).not.toContainTopic(
                        "playPrivateAudio"
                    );
                    const fifteenSecondsAfterState = getResults(
                        rule,
                        {
                            [rules.assistant.midas]: "PRIVATE",
                            time: 115,
                            alive: true,
                            inGame: true,
                            items: MIDAS_ON_COOLDOWN,
                        },
                        firstSeenMidasState
                    ) as any;
                    expect(fifteenSecondsAfterState).not.toContainTopic(
                        "playPrivateAudio"
                    );
                    const thirtySecondsAfterState = getResults(
                        rule,
                        {
                            [rules.assistant.midas]: "PRIVATE",
                            time: 130,
                            alive: true,
                            inGame: true,
                            items: MIDAS_ON_COOLDOWN_BACKPACK,
                        },
                        fifteenSecondsAfterState
                    ) as any;
                    expect(thirtySecondsAfterState).not.toContainTopic(
                        "playPrivateAudio"
                    );
                });
            });
        });
    });

    describe("dead", () => {
        test("should not remind about midas", () => {
            const firstSeenMidasState = getResults(rule, {
                [rules.assistant.midas]: "PRIVATE",
                time: 100,
                alive: false,
                inGame: true,
                items: MIDAS_CAN_CAST,
            }) as any;
            expect(firstSeenMidasState).not.toContainTopic("playPrivateAudio");
            const fifteenSecondsAfterState = getResults(
                rule,
                {
                    [rules.assistant.midas]: "PRIVATE",
                    time: 115,
                    alive: false,
                    inGame: true,
                    items: MIDAS_CAN_CAST,
                },
                firstSeenMidasState
            ) as any;
            expect(fifteenSecondsAfterState).not.toContainTopic(
                "playPrivateAudio"
            );
        });
    });

    describe("has no midas", () => {
        test("should not remind about midas", () => {
            const firstSeenMidasState = getResults(rule, {
                [rules.assistant.midas]: "PRIVATE",
                time: 100,
                alive: true,
                inGame: true,
                items: NO_MIDAS,
            }) as any;
            expect(firstSeenMidasState).not.toContainTopic("playPrivateAudio");
            const fifteenSecondsAfterState = getResults(
                rule,
                {
                    [rules.assistant.midas]: "PRIVATE",
                    time: 115,
                    alive: true,
                    inGame: true,
                    items: NO_MIDAS,
                },
                firstSeenMidasState
            ) as any;
            expect(fifteenSecondsAfterState).not.toContainTopic(
                "playPrivateAudio"
            );
        });
    });
});
