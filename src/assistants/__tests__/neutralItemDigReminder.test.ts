import { DeepReadonly } from "ts-essentials";
import Fact from "../../engine/Fact";
import Item from "../../gsi-data-classes/Item";
import neutralItemRule from "../neutralItemDigReminder";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rules from "../../rules";

const NO_ITEMS = new PlayerItems(
    [],
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const TRUSTY_SHOVEL = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_trusty_shovel", "Trusty Shovel", undefined, undefined, true)
);

const PIRATE_HAT = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_pirate_hat", "Pirate Hat", undefined, undefined, true)
);

const SHOVEL_ON_COOLDOWN = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_trusty_shovel", "Trusty Shovel", undefined, undefined, false)
);

const SHOVEL_ON_COOLDOWN_IN_BACKPACK = new PlayerItems(
    [],
    [
        new Item(
            "item_trusty_shovel",
            "Trusty Shovel",
            undefined,
            undefined,
            false
        ),
    ],
    [],
    null,
    null
);

const SHOVEL_READY_IN_BACKPACK = new PlayerItems(
    [],
    [
        new Item(
            "item_trusty_shovel",
            "Trusty Shovel",
            undefined,
            undefined,
            true
        ),
    ],
    [],
    null,
    null
);

const params = {
    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
    alive: true,
    inGame: true,
    items: TRUSTY_SHOVEL,
    time: 100,
};

describe("neutral item dig reminder", () => {
    describe("player is dead", () => {
        test("do not remind of shovel", () => {
            const result = getResults(neutralItemRule, {
                ...params,
                alive: false,
            });
            expect(result).not.toContainAudioEffect();
        });
    });

    describe("player is alive", () => {
        describe("no neutral item", () => {
            test("do not remind of shovel", () => {
                const result = getResults(neutralItemRule, {
                    ...params,
                    items: NO_ITEMS,
                });
                expect(result).not.toContainAudioEffect();
            });
        });

        describe("neutral item is ready to dig", () => {
            let seenShovelState: Fact<unknown>[];
            beforeEach(() => {
                seenShovelState = getResults(neutralItemRule, {
                    ...params,
                    items: TRUSTY_SHOVEL,
                });
            });
            test("should not remind immediately after seeing shovel", () => {
                expect(seenShovelState).not.toContainAudioEffect();
            });
            describe("14 seconds after", () => {
                test("trusty shovel in neutral slot", () => {
                    const resultAfter14Sec = getResults(
                        neutralItemRule,
                        {
                            ...params,
                            items: TRUSTY_SHOVEL,
                            time: 114,
                        },
                        seenShovelState
                    );
                    expect(resultAfter14Sec).not.toContainAudioEffect();
                });
            });
            describe("15 seconds after", () => {
                describe("item ready", () => {
                    test("trusty shovel in neutral slot", () => {
                        const resultAfter15Sec = getResults(
                            neutralItemRule,
                            {
                                ...params,
                                items: TRUSTY_SHOVEL,
                                time: 115,
                            },
                            seenShovelState
                        );
                        expect(resultAfter15Sec).toContainAudioEffect("dig");
                    });
                    test("trusty shovel in backpack", () => {
                        const resultAfter15Sec = getResults(
                            neutralItemRule,
                            {
                                ...params,
                                items: SHOVEL_READY_IN_BACKPACK,
                                time: 115,
                            },
                            seenShovelState
                        );
                        expect(resultAfter15Sec).toContainAudioEffect("dig");
                    });
                    test("pirate hat in neutral slot", () => {
                        const resultAfter15Sec = getResults(
                            neutralItemRule,
                            {
                                ...params,
                                items: PIRATE_HAT,
                                time: 115,
                            },
                            seenShovelState
                        );
                        expect(resultAfter15Sec).toContainAudioEffect("dig");
                    });
                });
                describe("item not ready", () => {
                    test("in neutral slot", () => {
                        const resultAfter15Sec = getResults(
                            neutralItemRule,
                            {
                                ...params,
                                items: SHOVEL_ON_COOLDOWN,
                                time: 115,
                            },
                            seenShovelState
                        );
                        expect(resultAfter15Sec).not.toContainAudioEffect();
                    });
                    test("in backpack slot", () => {
                        const resultAfter15Sec = getResults(
                            neutralItemRule,
                            {
                                ...params,
                                items: SHOVEL_ON_COOLDOWN_IN_BACKPACK,
                                time: 115,
                            },
                            seenShovelState
                        );
                        expect(resultAfter15Sec).not.toContainAudioEffect();
                    });
                });
            });
        });
    });
});
