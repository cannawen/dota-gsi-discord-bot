/* eslint-disable no-magic-numbers*/
const TimeConstants = {
    BOUNTY_RUNE_SPAWN_INTERVAL:      3 * 60,
    GAME_START_TIME:                 0,
    HEADS_UP_TIME_BEFORE_RUNE_SPAWN: 20,
    RIVER_RUNE_SPAWN_INTERVAL:       2 * 60,
    WATER_RUNE_END_TIME:             4 * 60,
};
/* eslint-enable no-magic-numbers*/

const RuneConstants = {
    BOUNTY_RUNES: "BOUNTY_RUNES",
    POWER_RUNES:  "POWER_RUNES",
    WATER_RUNES:  "WATER_RUNES",
};

function hash(object) {
    return JSON.stringify(object.sort());
}

const AudioMapping = {
    [hash([ RuneConstants.BOUNTY_RUNES, RuneConstants.POWER_RUNES ])]: "./runes/audio/bounty_and_power_runes.wav",
    [hash([RuneConstants.BOUNTY_RUNES])]:                              "./runes/audio/bounty_runes.wav",
    [hash([RuneConstants.POWER_RUNES])]:                               "./runes/audio/power_rune.wav",
    [hash([RuneConstants.WATER_RUNES])]:                               "./runes/audio/water_runes.wav",
    [hash([])]:                                                        null,
};

function gameNotStartedYet(time) {
    return time <= TimeConstants.GAME_START_TIME;
}

function multipleOf(dividend, divisor) {
    // eslint-disable-next-line no-magic-numbers
    return dividend % divisor === 0;
}

/* eslint-disable max-len */
const runeToFn = {
    [RuneConstants.WATER_RUNES]:  (time) => multipleOf(time, TimeConstants.RIVER_RUNE_SPAWN_INTERVAL) && time <= TimeConstants.WATER_RUNE_END_TIME,
    [RuneConstants.POWER_RUNES]:  (time) => multipleOf(time, TimeConstants.RIVER_RUNE_SPAWN_INTERVAL) && TimeConstants.WATER_RUNE_END_TIME < time,
    [RuneConstants.BOUNTY_RUNES]: (time) => multipleOf(time, TimeConstants.BOUNTY_RUNE_SPAWN_INTERVAL),
};
/* eslint-enable max-len */

/**
 * Given a time, returns which runes are spawning
 * @param {int} time game time
 * @returns {Array} array of RuneConstants that spawn at this time. May be empty array
 */
function runeLogic(time) {
    return Object.keys(runeToFn).filter((constant) => runeToFn[constant](time));
}

/**
 *
 * @param {int} time time in seconds
 * @returns {String} name of audio file to play. May be null
 */
function timeHandler(time) {
    if (gameNotStartedYet(time)) {
        return null;
    }

    const spawningRunes = runeLogic(time + TimeConstants.HEADS_UP_TIME_BEFORE_RUNE_SPAWN);

    return AudioMapping[hash(spawningRunes)];
}

module.exports = {
    event:   "map:clock_time",
    handler: timeHandler,
};
