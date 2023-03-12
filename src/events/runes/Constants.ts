/* eslint-disable no-magic-numbers*/
const Time = {
    ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN: 15,
    BOUNTY_RUNE_SPAWN_INTERVAL:              3 * 60,
    GAME_START_TIME:                         0,
    RIVER_RUNE_SPAWN_INTERVAL:               2 * 60,
    WATER_RUNE_END_TIME:                     4 * 60,
};

enum RuneId {
    NONE = 0,
    BOUNTY = 1 << 1,
    POWER = 1 << 2,
    WATER = 1 << 3,
}
/* eslint-enable no-magic-numbers*/

const Audio = {
    [RuneId.BOUNTY | RuneId.POWER]: "bounty_and_power_runes.wav",
    [RuneId.BOUNTY]:                "bounty_runes.wav",
    [RuneId.POWER]:                 "power_rune.wav",
    [RuneId.WATER]:                 "water_runes.wav",
    [RuneId.NONE]:                  null,
};

export default {
    Audio,
    RuneId,
    Time,
};
