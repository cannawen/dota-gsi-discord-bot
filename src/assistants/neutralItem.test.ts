import engine from "../customEngine";
jest.mock("../customEngine");
import "./neutralItem";

describe("neutral item", () => {
    test("should register with engine", () => {
        expect(engine.register).toHaveBeenCalled();
    });
});
