const Time = {
    ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN: 15,
    BOUNTY_RUNE_SPAWN_INTERVAL:              3 * 60,
    GAME_START_TIME:                         0,
    RIVER_RUNE_SPAWN_INTERVAL:               2 * 60,
    WATER_RUNE_END_TIME:                     4 * 60,
};

enum RuneId {
    NONE = 0,
    BOUNTY = 1,
    POWER = 1 << 1,
    WATER = 1 << 2,
}

const Audio = {
    [RuneId.BOUNTY | RuneId.POWER]: "rune-sound.mp3",
    [RuneId.BOUNTY]:                "rune-sound.mp3",
    [RuneId.POWER]:                 "rune-sound.mp3",
    [RuneId.WATER]:                 "rune-sound.mp3",
    [RuneId.NONE]:                  null,
};

export default {
    Audio,
    RuneId,
    Time,
};
