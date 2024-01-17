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
    test("warn at 20 minutes", () => {
        const result = getResults(rule, { ...params, time: 20 * 60 });
        expect(result).toContainAudioEffect("tormenter's up.");
    });
});
