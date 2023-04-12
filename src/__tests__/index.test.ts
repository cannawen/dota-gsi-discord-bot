jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/discordClient");
jest.mock("../server");
import engine from "../customEngine";

import { registerEverything } from "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        registerEverything();

        const assistantCount = 9;
        const assistantExcessRuleCount = 3;
        const discordRuleCount = 3;
        const effectRuleCount = 5;
        const gsiRuleCount = 5;

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
