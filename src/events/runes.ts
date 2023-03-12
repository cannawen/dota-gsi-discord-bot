import path from "node:path";

/* eslint-disable no-magic-numbers*/
const TimeConstants = {
    ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN: 15,
    BOUNTY_RUNE_SPAWN_INTERVAL:              3 * 60,
    GAME_START_TIME:                         0,
    RIVER_RUNE_SPAWN_INTERVAL:               2 * 60,
    WATER_RUNE_END_TIME:                     4 * 60,
};

enum RuneId {
    NO_RUNES = 0,
    BOUNTY_RUNES = 1 << 1,
    POWER_RUNES = 1 << 2,
    WATER_RUNES = 1 << 3,
}
/* eslint-enable no-magic-numbers*/

const AudioMapping = {
    [RuneId.BOUNTY_RUNES | RuneId.POWER_RUNES]: "bounty_and_power_runes.wav",
    [RuneId.BOUNTY_RUNES]:                      "bounty_runes.wav",
    [RuneId.POWER_RUNES]:                       "power_rune.wav",
    [RuneId.WATER_RUNES]:                       "water_runes.wav",
    [RuneId.NO_RUNES]:                          null,
};

class Rune {
    runeId: RuneId;
    spawnsAt: (time: number) => boolean;

    constructor(runeId : RuneId, spawnsAt:(time: number) => boolean) {
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
    new Rune(RuneId.WATER_RUNES, (time) => multipleOf(time, TimeConstants.RIVER_RUNE_SPAWN_INTERVAL) && time <= TimeConstants.WATER_RUNE_END_TIME),
    new Rune(RuneId.POWER_RUNES, (time) => multipleOf(time, TimeConstants.RIVER_RUNE_SPAWN_INTERVAL) && TimeConstants.WATER_RUNE_END_TIME < time),
    new Rune(RuneId.BOUNTY_RUNES, (time) => multipleOf(time, TimeConstants.BOUNTY_RUNE_SPAWN_INTERVAL)),
];
/* eslint-enable max-len */

function gameNotStartedYet(time: number) {
    return time <= TimeConstants.GAME_START_TIME;
}

export default function handler(time: number): string | null {
    if (gameNotStartedYet(time)) {
        return null;
    }
    const audioKey = runeLogics
        .filter((runeLogic) => runeLogic.spawnsAt(time + TimeConstants.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN))
        .map((runeLogic) => runeLogic.runeId)
        .reduce((memo, runeConstant) => memo | runeConstant, RuneId.NO_RUNES);

    const audioFileName = AudioMapping[audioKey];

    if (audioFileName) {
        return path.join(__dirname, "../../audio/runes", audioFileName);
    } else {
        return null;
    }
}
