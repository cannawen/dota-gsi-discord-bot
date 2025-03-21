import rule from "../tormenter";
import rules from "../../rules";

let params: any;
describe("tormenter", () => {
    beforeEach(() => {
        params = {
            customGameName: "",
            [rules.assistant.tormenter]: "PUBLIC",
            inGame: true,
            time: 0,
        };
    });
    test("warn at 14 minutes", () => {
        const result = getResults(rule, { ...params, time: 14 * 60 });
        expect(result).toContainAudioEffect("tormenter spawns soon.");
    });
    test("warn at 15 minutes", () => {
        const result = getResults(rule, { ...params, time: 15 * 60 });
        expect(result).toContainAudioEffect("tormenter's up.");
    });
});
