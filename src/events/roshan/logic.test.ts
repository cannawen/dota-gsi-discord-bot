import logic from "./logic";

describe("roshan", () => {
    test("roshan is alive", () => {
        expect(logic.currentRoshState).toBe(logic.RoshState.ALIVE);
    });
});
