import Constants from "./Constants";
import logic from "./logic";

/**
 *
 * @param time time, in minutes
 * @returns time, in seconds, less the advanced warning time before rune spawn
 */
function spawnsAtMinute(time: number) : number {
    // eslint-disable-next-line no-extra-parens
    return (time * 60);
}

describe("rune event", () => {
    describe("before the game starts", () => {
        test("runes do not spawn", () => {
            expect(logic(spawnsAtMinute(-1))).toBe(Constants.RuneId.NONE);
            expect(logic(spawnsAtMinute(-2))).toBe(Constants.RuneId.NONE);
            expect(logic(spawnsAtMinute(-3))).toBe(Constants.RuneId.NONE);
            expect(logic(spawnsAtMinute(-6))).toBe(Constants.RuneId.NONE);
        });
    });

    describe("at zero minutes", () => {
        test("spawns only bounty runes", () => {
            expect(logic(spawnsAtMinute(0))).toBe(Constants.RuneId.BOUNTY);
        });
    });

    describe("at non-rune spawning times after the game starts", () => {
        test("no runes", () => {
            expect(logic(spawnsAtMinute(1))).toBe(Constants.RuneId.NONE);
            expect(logic(spawnsAtMinute(61))).toBe(Constants.RuneId.NONE);
        });
    });

    describe("every 6 minutes", () => {
        test("spawns bounty and power runes", () => {
            expect(logic(spawnsAtMinute(6))).toBe(Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
            expect(logic(spawnsAtMinute(60))).toBe(Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
        });
    });

    describe("every 3 minutes", () => {
        test("spawns bounty runes", () => {
            expect(logic(spawnsAtMinute(3))).toBe(Constants.RuneId.BOUNTY);
            expect(logic(spawnsAtMinute(63))).toBe(Constants.RuneId.BOUNTY);
        });
    });

    describe("at 2 and 4 minutes", () => {
        test("spawns water runes", () => {
            expect(logic(spawnsAtMinute(2))).toBe(Constants.RuneId.WATER);
            expect(logic(spawnsAtMinute(4))).toBe(Constants.RuneId.WATER);
        });
    });

    describe("every 2 minutes, after 4 minutes", () => {
        test("spawns power rune", () => {
            expect(logic(spawnsAtMinute(8))).toBe(Constants.RuneId.POWER);
            expect(logic(spawnsAtMinute(62))).toBe(Constants.RuneId.POWER);
        });
    });
});
