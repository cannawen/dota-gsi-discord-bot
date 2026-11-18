import rule from "../tormenter";
import rules from "../../rules";

let params: any;
describe("tormenter", () => {
    beforeEach(() => {
        params = {
            customGameName: "",
            [rules.assistant.tormenter]: "PUBLIC",
            inGame: true,
            daytime: true,
            time: 0,
        };
    });
    test.only("warn at 14 minutes - day time means bottom", () => {
        const result = getResults(rule, { ...params, daytime: false, time: 14 * 60 });
        expect(result).toContainAudioEffect("tormenter spawns bottom in 1 minute.");
    });
    test("warn at 14 minutes - night time means top", () => {
        const result = getResults(rule, { ...params, daytime: true, time: 14 * 60 });
        expect(result).toContainAudioEffect("tormenter spawns top in 1 minute.");
    });
    test("warn at 15 minutes", () => {
        const result = getResults(rule, { ...params, time: 15 * 60 });
        expect(result).toContainAudioEffect("tormenter's up.");
    });
});
