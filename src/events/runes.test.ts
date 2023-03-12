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
        test("not return audio for 0 minute rune", () => {
            expect(runes(spawnsAtMinute(0))).toBeNull();
        });
        test("not return audio path when runes are spawning", () => {
            expect(runes(spawnsAtMinute(1))).toBeNull();
            expect(runes(spawnsAtMinute(61))).toBeNull();
        });
    });

    describe("bounty and power runes", () => {
        test("return bounty and power rune audio path every 6 minutes", () => {
            expect(runes(spawnsAtMinute(6))).toMatch("bounty_and_power_runes.wav");
            expect(runes(spawnsAtMinute(60))).toMatch("bounty_and_power_runes.wav");
        });
    });

    describe("bounty runes", () => {
        test("return bounty rune audio path every 3 minutes", () => {
            expect(runes(spawnsAtMinute(3))).toMatch("bounty_runes.wav");
            expect(runes(spawnsAtMinute(63))).toMatch("bounty_runes.wav");
        });
    });

    describe("water runes", () => {
        test("return water rune audio path every 2 minutes prior to 4 minute mark", () => {
            expect(runes(spawnsAtMinute(2))).toMatch("water_runes.wav");
            expect(runes(spawnsAtMinute(4))).toMatch("water_runes.wav");
        });
    });

    describe("power rune", () => {
        test("return power rune audio path every 2 minutes after 4 minute mark", () => {
            expect(runes(spawnsAtMinute(8))).toMatch("power_rune.wav");
            expect(runes(spawnsAtMinute(62))).toMatch("power_rune.wav");
        });
    });
});
