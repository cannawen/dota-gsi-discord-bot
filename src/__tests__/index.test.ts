jest.mock("node-gsi");
jest.mock("../customEngine");
jest.mock("../discord/client");
jest.mock("../server");
import engine from "../customEngine";

import "../index";

describe("during app startup", () => {
    test("should register all rules with engine", () => {
        // 6 for assistants, 2 for discord, 2 for effects, 6 for gsi
        expect(engine.register).toHaveBeenCalledTimes(16);
    });
});
