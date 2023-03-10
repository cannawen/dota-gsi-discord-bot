const Constants = require("./Constants");

const LEAD_TIME = 20; // How much warning before a rune spawns

const WATER_RUNE_END_TIME = 4 * 60;
const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

function pregame(time) {
    return time <= 0;
}

function waterRuneSpawning(time) {
    return riverRuneSpawning(time) && time <= WATER_RUNE_END_TIME;
}

function riverRuneSpawning(time) {
    return time % RIVER_RUNE_SPAWN_INTERVAL == 0;
}

function bountyRuneSpawning(time) {
    return time % BOUNTY_RUNE_SPAWN_INTERVAL == 0;
}

function clockHandler(time) {
    const effectiveTime = time + LEAD_TIME;

    if (pregame(effectiveTime)) {
        return;
    } 
    if (waterRuneSpawning(effectiveTime)) {
        return Constants.WATER_RUNES;
    }
    if (riverRuneSpawning(effectiveTime) && bountyRuneSpawning(effectiveTime)) {
        return Constants.BOUNTY_AND_POWER_RUNES;
    }
    if (riverRuneSpawning(effectiveTime)) {
        return Constants.POWER_RUNES;
    }
    if (bountyRuneSpawning(effectiveTime)) {
        return Constants.BOUNTY_RUNES;
    }
}

module.exports = { event: 'map:clock_time', handler: clockHandler }
