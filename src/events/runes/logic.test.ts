import logic from "./logic";
import Constants from "./Constants";

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
    describe("no runes", () => {
        // test("not return audio for 0 minute rune", () => {
        //     expect(runes(spawnsAtMinute(0))).toBeNull();
        // });
        test("not return audio path when runes are spawning", () => {
            expect(logic(spawnsAtMinute(1))).toBe(Constants.RuneId.NONE);
            expect(logic(spawnsAtMinute(61))).toBe(Constants.RuneId.NONE);
        });
    });

    describe("bounty and power runes", () => {
        test("return bounty and power rune audio path every 6 minutes", () => {
            expect(logic(spawnsAtMinute(6))).toBe(Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
            expect(logic(spawnsAtMinute(60))).toBe(Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
        });
    });

    describe("bounty runes", () => {
        test("return bounty rune audio path every 3 minutes", () => {
            expect(logic(spawnsAtMinute(3))).toBe(Constants.RuneId.BOUNTY);
            expect(logic(spawnsAtMinute(63))).toBe(Constants.RuneId.BOUNTY);
        });
    });

    describe("water runes", () => {
        test("return water rune audio path every 2 minutes prior to 4 minute mark", () => {
            expect(logic(spawnsAtMinute(2))).toBe(Constants.RuneId.WATER);
            expect(logic(spawnsAtMinute(4))).toBe(Constants.RuneId.WATER);
        });
    });

    describe("power rune", () => {
        test("return power rune audio path every 2 minutes after 4 minute mark", () => {
            expect(logic(spawnsAtMinute(8))).toBe(Constants.RuneId.POWER);
            expect(logic(spawnsAtMinute(62))).toBe(Constants.RuneId.POWER);
        });
    });
});
