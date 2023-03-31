jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/client");
jest.mock("../server");
import engine from "../customEngine";

import "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        const assistantRuleCount = 9;
        const assistantConfigCount = 6;
        const discordRuleCount = 2;
        const effectRuleCount = 5;
        const gsiRuleCount = 8;
        expect(engine.register).toHaveBeenCalledTimes(
            assistantRuleCount +
                assistantConfigCount +
                discordRuleCount +
                effectRuleCount +
                gsiRuleCount
        );
    });
});
