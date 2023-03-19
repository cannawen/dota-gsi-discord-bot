import Constants from "./Constants";
import logic from "./logic";

describe("roshan", () => {
    describe("has never been killed before", () => {
        test("roshan is alive", () => {
            expect(logic(0, undefined)).toBe(Constants.Status.ALIVE);
        });
    });

    describe("was killed < 8 minutes ago", () => {
        test("roshan is dead", () => {
            expect(logic(1, 0)).toBe(Constants.Status.DEAD);
            expect(logic(8 * 60 - 1, 0)).toBe(Constants.Status.DEAD);
        });
    });

    describe("was killed 8-11 minutes ago", () => {
        test("roshan is maybe alive or dead", () => {
            expect(logic(8 * 60, 0)).toBe(Constants.Status.UNKNOWN);
            expect(logic(9 * 60, 0)).toBe(Constants.Status.UNKNOWN);
            expect(logic(11 * 60 - 1, 0)).toBe(Constants.Status.UNKNOWN);
        });
    });

    describe("was killed 11+ minutes ago", () => {
        test("roshan is alive", () => {
            expect(logic(11 * 60, 0)).toBe(Constants.Status.ALIVE);
            expect(logic(60 * 60, 0)).toBe(Constants.Status.ALIVE);
        });
    });
});
