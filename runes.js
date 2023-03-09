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

function runeString(time) {
    const leadTime = 20;
    const effectiveTime = time + leadTime;

    if (pregame(effectiveTime)) {
        return;
    } 
    if (waterRuneSpawning(effectiveTime)) {
        return "water runes";
    }
    if (riverRuneSpawning(effectiveTime) && bountyRuneSpawning(effectiveTime)) {
        return "bounty and power runes";
    }
    if (riverRuneSpawning(effectiveTime)) {
        return "power rune";
    }
    if (bountyRuneSpawning(effectiveTime)) {
        return "bounty runes";
    }
}

module.exports = { event: 'map:clock_time', handler: runeString }
