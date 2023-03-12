import Constants from "./Constants";

class Rune {
    runeId: number;
    spawnsAt: (time: number) => boolean;

    constructor(runeId : number, spawnsAt:(time: number) => boolean) {
        this.runeId = runeId;
        this.spawnsAt = spawnsAt;
    }
}

function multipleOf(dividend: number, divisor: number) {
    // eslint-disable-next-line no-magic-numbers
    return dividend % divisor === 0;
}

/* eslint-disable max-len */
const runeLogics = [
    new Rune(Constants.RuneId.WATER, (time) => multipleOf(time, Constants.Time.RIVER_RUNE_SPAWN_INTERVAL) && time <= Constants.Time.WATER_RUNE_END_TIME),
    new Rune(Constants.RuneId.POWER, (time) => multipleOf(time, Constants.Time.RIVER_RUNE_SPAWN_INTERVAL) && Constants.Time.WATER_RUNE_END_TIME < time),
    new Rune(Constants.RuneId.BOUNTY, (time) => multipleOf(time, Constants.Time.BOUNTY_RUNE_SPAWN_INTERVAL)),
];
/* eslint-enable max-len */

export default function timeToRuneIdBitmap(time : number) : number {
    return runeLogics
        .filter((runeLogic) => runeLogic.spawnsAt(time))
        .map((runeLogic) => runeLogic.runeId)
        .reduce((memo, runeConstant) => memo | runeConstant, Constants.RuneId.NONE);
}
