import path from "node:path";

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

function runeSpawn(time : number) : number {
    return runeLogics
        .filter((runeLogic) => runeLogic.spawnsAt(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN))
        .map((runeLogic) => runeLogic.runeId)
        .reduce((memo, runeConstant) => memo | runeConstant, Constants.RuneId.NONE);
}

function gameNotStartedYet(time: number) {
    return time <= Constants.Time.GAME_START_TIME;
}

function handler(time: number): string | null {
    if (gameNotStartedYet(time)) {
        return null;
    }

    const audioKey = runeSpawn(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);

    const audioFileName = Constants.Audio[audioKey];

    if (audioFileName) {
        return path.join(__dirname, "../../audio/runes", audioFileName);
    } else {
        return null;
    }
}

export default {
    // for testing
    runeSpawn,
    // public
    handler,
};
