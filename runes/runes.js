/*
 * Const Constants = require("./Constants");
 * const AudioMapping = require("./AudioMapping");
 */

const HEADS_UP_TIME_BEFORE_RUNE_SPAWN = 20;

const WATER_RUNE_END_TIME = 4 * 60;
const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

const Constants = {
    BOUNTY_RUNES: "BOUNTY_RUNES",
    POWER_RUNES:  "POWER_RUNES",
    WATER_RUNES:  "WATER_RUNES",
};

function hash(object) {
    return JSON.stringify(object.sort());
}

const AudioMapping = {
    [hash([ Constants.BOUNTY_RUNES, Constants.POWER_RUNES ])]: "./runes/audio/bounty_and_power_runes.wav",
    [hash([Constants.BOUNTY_RUNES])]:                          "./runes/audio/bounty_runes.wav",
    [hash([Constants.POWER_RUNES])]:                           "./runes/audio/power_rune.wav",
    [hash([Constants.WATER_RUNES])]:                           "./runes/audio/water_runes.wav",
    [hash([])]:                                                null,
};

function gameNotStartedYet(time) {
    // eslint-disable-next-line no-magic-numbers
    return time <= 0;
}

function multipleOf(dividend, divisor) {
    // eslint-disable-next-line no-magic-numbers
    return dividend % divisor === 0;
}

const runeToFn = {
    [Constants.WATER_RUNES]:  (time) => multipleOf(time, RIVER_RUNE_SPAWN_INTERVAL) && time <= WATER_RUNE_END_TIME,
    [Constants.POWER_RUNES]:  (time) => multipleOf(time, RIVER_RUNE_SPAWN_INTERVAL) && WATER_RUNE_END_TIME < time,
    [Constants.BOUNTY_RUNES]: (time) => multipleOf(time, BOUNTY_RUNE_SPAWN_INTERVAL),
};

/**
 *
 * @param {int} time game time
 * @returns {Array} array of runes that spawn at this time
 */
function runeLogic(time) {
    return Object.keys(runeToFn).filter((constant) => runeToFn[constant](time));
}

/**
 *
 * @param {int} time current time in seconds
 * @returns {String} name of audio file to play, or null if no audio should be played
 */
function timeHandler(time) {
    if (gameNotStartedYet(time)) {
        return null;
    }

    const spawningRunes = runeLogic(time + HEADS_UP_TIME_BEFORE_RUNE_SPAWN);

    return AudioMapping[hash(spawningRunes)];
}

module.exports = {
    event:   "map:clock_time",
    handler: timeHandler,
};
