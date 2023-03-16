enum Status {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
    UNKNOWN = "UNKNOWN",
}

enum RespawnTime {
    MINIMUM = 8 * 60,
    MAXIMUM = 11 * 60,
}

export default {
    RespawnTime,
    Status,
};
