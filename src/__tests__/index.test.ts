jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/client");
jest.mock("../server");
import engine from "../customEngine";

import "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        // 7 for assistants
        // 2 for discord
        // 3 for effects
        // 6 for gsi
        expect(engine.register).toHaveBeenCalledTimes(18);
    });
});
