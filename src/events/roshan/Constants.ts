enum Status {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
    UNKNOWN = "UNKNOWN",
}

const MINIMUM_RESPAWN_SECONDS = 8 * 60;
const MAXIMUM_RESPAWN_SECONDS = 11 * 60;

export default {
    MAXIMUM_RESPAWN_SECONDS,
    MINIMUM_RESPAWN_SECONDS,
    Status,
};
