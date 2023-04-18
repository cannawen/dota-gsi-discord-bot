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

        const assistantCount = 16;
        const assistantExcessRuleCount = 3;
        const discordRuleCount = 3;
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
