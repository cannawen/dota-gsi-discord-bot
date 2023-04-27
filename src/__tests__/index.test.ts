jest.mock("node-cron");
jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/discordClient");
jest.mock("../server");
jest.mock("../log");
import engine from "../customEngine";

import { registerEverything } from "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        registerEverything();

        const debugRuleCount = 0;

        const assistantCount = 19;
        const assistantExcessRuleCount = 11;
        const discordRuleCount = 4;
        const effectRuleCount = 4;
        const gsiRuleCount = 6;

        expect(engine.register).toHaveBeenCalledTimes(
            debugRuleCount +
                // One for the main rule, one for the configuration rule
                assistantCount * 2 +
                assistantExcessRuleCount +
                discordRuleCount +
                effectRuleCount +
                gsiRuleCount
        );
    });
});
