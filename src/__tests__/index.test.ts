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
        expect(engine.register).toHaveBeenCalled();
    });
});
