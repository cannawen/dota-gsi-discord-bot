import { DeepReadonly } from "ts-essentials";
import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../teleport";
import rules from "../../rules";

const NO_TP = new PlayerItems(
    [],
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;
const HAS_TP = new PlayerItems(
    [],
    [],
    [],
    new Item("TP Scroll"),
    null
) as DeepReadonly<PlayerItems>;

const params = {
    customGameName: "",
    [rules.assistant.tp]: "PRIVATE",
    gold: 100,
    inGame: true,
    items: HAS_TP,
    time: 1000,
};

describe("tp reminder reminder", () => {
    describe("player has tp scroll", () => {
        test("after 60 seconds of not having one, remind", () => {
            const hasTP = getResults(rule, params);
            expect(hasTP).not.toContainAudioEffect();

            const usedTP = getResults(
                rule,
                {
                    ...params,
                    items: NO_TP,
                    time: 1010,
                },
                hasTP
            );
            expect(usedTP).not.toContainAudioEffect();

            const after60Sec = getResults(
                rule,
                {
                    ...params,
                    items: NO_TP,
                    time: 1060,
                },
                usedTP
            );

            expect(after60Sec).toContainAudioEffect("Buy a teleport scroll.");
        });
    });
});
