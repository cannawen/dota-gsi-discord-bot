import rule from "../randomItem";
import rules from "../../rules";

describe("random item", () => {
    beforeEach(() => {
        jest.spyOn(global.Math, "random").mockReturnValue(0);
    });

    test("responds you should buy an item", () => {
        const results = getResults(rule, {
            customGameName: "",
            [rules.assistant.randomItem]: "PUBLIC",
            lastDiscordUtterance: "what should I buy with 570 gold",
        });
        expect(results).toContainAudioEffect(
            expect.stringContaining("Chainmail")
        );
    });

    afterEach(() => {
        jest.spyOn(global.Math, "random").mockRestore();
    });
});
