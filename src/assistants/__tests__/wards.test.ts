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

const params = {
    customGameName: "",
    [rules.assistant.wards]: "PRIVATE",
    inGame: true,
    time: 1000,
    items: NO_WARDS,
};

describe("wards, in game", () => {
    describe("no change in ward count", () => {
        test("reminds user after 540s", () => {
            const noWardState = getResults(rule, params);
            const noWardStateLater = getResults(
                rule,
                {
                    ...params,
                    time: 1540,
                },
                noWardState
            );
            expect(noWardStateLater).toContainAudioEffect("buy wards");
        });
    });
    describe("decrease in ward count", () => {
        test("reminds user after 540s", () => {
            const twoWardState = getResults(rule, {
                ...params,
                items: TWO_WARDS,
            });
            const oneWardState = getResults(
                rule,
                {
                    ...params,
                    time: 1540,
                    items: ONE_WARD,
                },
                twoWardState
            );
            expect(oneWardState).toContainAudioEffect("buy wards");
        });
    });
    describe("increase in ward count", () => {
        test("does not remind after 540s", () => {
            const oneWardState = getResults(rule, {
                ...params,
                items: ONE_WARD,
            });
            const twoWardState = getResults(
                rule,
                {
                    ...params,
                    time: 1500,
                    items: TWO_WARDS,
                },
                oneWardState
            );
            expect(oneWardState).not.toContainAudioEffect();
            const noWardState = getResults(
                rule,
                {
                    ...params,
                    time: 1540,
                    items: NO_WARDS,
                },
                twoWardState
            );
            expect(noWardState).not.toContainAudioEffect();
        });
    });
});
