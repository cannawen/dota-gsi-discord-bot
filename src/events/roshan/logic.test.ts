import logic from "./logic";

describe("roshan", () => {
    test("roshan is alive", () => {
        expect(logic.currentRoshState).toBe(logic.RoshState.ALIVE);
    });
    test("roshan is killed", () => {
        logic.setTime(1000);
        logic.roshKilled();
        expect(logic.currentRoshState).toBe(logic.RoshState.DEAD);
    });
});
