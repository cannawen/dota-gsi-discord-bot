import { getResults } from "../../__tests__/helpers";
import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../wards";
import rules from "../../rules";

const NO_WARDS = new PlayerItems([], [], [], null, null);
const ONE_WARD = new PlayerItems(
    [new Item("item_ward_observer")],
    [],
    [],
    null,
    null
);
const TWO_WARDS = new PlayerItems(
    [],
    [new Item("item_ward_dispenser")],
    [new Item("item_ward_sentry")],
    null,
    null
);

describe("wards", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                [rules.assistant.wards]: "PRIVATE",
                inGame: false,
                time: 100,
                items: NO_WARDS,
            });
            expect(results).toBeUndefined();
        });
    });

    describe("in game", () => {
        describe("no change in ward count", () => {
            test("reminds user after 540s", () => {
                const noWardState = getResults(rule, {
                    [rules.assistant.wards]: "PRIVATE",
                    inGame: true,
                    time: 1000,
                    items: NO_WARDS,
                }) as any;
                const noWardStateLater = getResults(
                    rule,
                    {
                        [rules.assistant.wards]: "PRIVATE",
                        inGame: true,
                        time: 1540,
                        items: NO_WARDS,
                    },
                    noWardState
                );
                expect(noWardStateLater).toContainFact(
                    "playPrivateAudio",
                    "resources/audio/wards.mp3"
                );
            });
        });
        describe("decrease in ward count", () => {
            test("reminds user after 540s", () => {
                const twoWardState = getResults(rule, {
                    [rules.assistant.wards]: "PRIVATE",
                    inGame: true,
                    time: 1000,
                    items: TWO_WARDS,
                }) as any;
                const oneWardState = getResults(
                    rule,
                    {
                        [rules.assistant.wards]: "PRIVATE",
                        inGame: true,
                        time: 1540,
                        items: ONE_WARD,
                    },
                    twoWardState
                );
                expect(oneWardState).toContainTopic("playPrivateAudio");
            });
        });
        describe("increase in ward count", () => {
            test("does not remind after 540s", () => {
                const oneWardState = getResults(rule, {
                    [rules.assistant.wards]: "PRIVATE",
                    inGame: true,
                    time: 1000,
                    items: ONE_WARD,
                }) as any;
                const twoWardState = getResults(
                    rule,
                    {
                        [rules.assistant.wards]: "PRIVATE",
                        inGame: true,
                        time: 1500,
                        items: TWO_WARDS,
                    },
                    oneWardState
                ) as any;
                const noWardState = getResults(
                    rule,
                    {
                        [rules.assistant.wards]: "PRIVATE",
                        inGame: true,
                        time: 1540,
                        items: NO_WARDS,
                    },
                    twoWardState
                );
                expect(noWardState).not.toContainTopic("playPrivateAudio");
            });
        });
    });
});
