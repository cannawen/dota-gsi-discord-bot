jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/client");
jest.mock("../server");
import engine from "../customEngine";

import "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        const assistantCount = 7;
        const assistantExcessRuleCount = 4;
        const discordRuleCount = 2;
        const effectRuleCount = 5;
        const gsiRuleCount = 6;
        expect(engine.register).toHaveBeenCalledTimes(
            // One for the main rule, one for the configuration rule
            assistantCount * 2 +
                assistantExcessRuleCount +
                discordRuleCount +
                effectRuleCount +
                gsiRuleCount
        );
    });
});
