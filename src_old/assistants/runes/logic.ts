import Constants from "./Constants";

class Rune {
    runeId: number;
    spawnsAt: (time: number) => boolean;

    constructor(runeId: number, spawnsAt: (time: number) => boolean) {
        this.runeId = runeId;
        this.spawnsAt = spawnsAt;
    }
}

function multipleOf(dividend: number, divisor: number) {
    return dividend % divisor === 0;
}

function shouldSpawnWaterRune(time: number): boolean {
    return (
        time > Constants.Time.GAME_START_TIME &&
        time <= Constants.Time.WATER_RUNE_END_TIME &&
        multipleOf(time, Constants.Time.RIVER_RUNE_SPAWN_INTERVAL)
    );
}

function shouldSpawnPowerRune(time: number): boolean {
    return (
        time > Constants.Time.GAME_START_TIME &&
        time > Constants.Time.WATER_RUNE_END_TIME &&
        multipleOf(time, Constants.Time.RIVER_RUNE_SPAWN_INTERVAL)
    );
}

function shouldSpawnBountyRune(time: number): boolean {
    return (
        time >= Constants.Time.GAME_START_TIME &&
        multipleOf(time, Constants.Time.BOUNTY_RUNE_SPAWN_INTERVAL)
    );
}
/**
 *
 * @param time game time
 * @returns bitmap of all `RuneId`s of runes spawning at this time
 */
export default function timeToRuneIdBitmap(time: number): number {
    return [
        new Rune(Constants.RuneId.WATER, shouldSpawnWaterRune),
        new Rune(Constants.RuneId.POWER, shouldSpawnPowerRune),
        new Rune(Constants.RuneId.BOUNTY, shouldSpawnBountyRune),
    ]
        .filter((runeLogic) => runeLogic.spawnsAt(time))
        .map((runeLogic) => runeLogic.runeId)
        .reduce(
            (memo, runeConstant) => memo | runeConstant,
            Constants.RuneId.NONE
        );
}
