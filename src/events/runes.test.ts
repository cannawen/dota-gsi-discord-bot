import runes from "./runes";

const ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN = 15;

/**
 *
 * @param time time, in minutes
 * @returns time, in seconds, less the advanced warning time before rune spawn
 */
function spawnsAtMinute(time: number) : number {
    // eslint-disable-next-line no-extra-parens
    return (time * 60) - ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN;
}

describe("rune event", () => {
    describe("no runes", () => {
        // test("not return audio for 0 minute rune", () => {
        //     expect(runes.runeSpawn(spawnsAtMinute(0))).toBeNull();
        // });
        test("not return audio path when runes are spawning", () => {
            expect(runes.runeSpawn(spawnsAtMinute(1))).toBe(runes.RuneId.NONE);
            expect(runes.runeSpawn(spawnsAtMinute(61))).toBe(runes.RuneId.NONE);
        });
    });

    describe("bounty and power runes", () => {
        test("return bounty and power rune audio path every 6 minutes", () => {
            expect(runes.runeSpawn(spawnsAtMinute(6))).toBe(runes.RuneId.BOUNTY | runes.RuneId.POWER);
            expect(runes.runeSpawn(spawnsAtMinute(60))).toBe(runes.RuneId.BOUNTY | runes.RuneId.POWER);
        });
    });

    describe("bounty runes", () => {
        test("return bounty rune audio path every 3 minutes", () => {
            expect(runes.runeSpawn(spawnsAtMinute(3))).toBe(runes.RuneId.BOUNTY);
            expect(runes.runeSpawn(spawnsAtMinute(63))).toBe(runes.RuneId.BOUNTY);
        });
    });

    describe("water runes", () => {
        test("return water rune audio path every 2 minutes prior to 4 minute mark", () => {
            expect(runes.runeSpawn(spawnsAtMinute(2))).toBe(runes.RuneId.WATER);
            expect(runes.runeSpawn(spawnsAtMinute(4))).toBe(runes.RuneId.WATER);
        });
    });

    describe("power rune", () => {
        test("return power rune audio path every 2 minutes after 4 minute mark", () => {
            expect(runes.runeSpawn(spawnsAtMinute(8))).toBe(runes.RuneId.POWER);
            expect(runes.runeSpawn(spawnsAtMinute(62))).toBe(runes.RuneId.POWER);
        });
    });
});
