export const enum Status {
    NOT_IN_A_GAME = "NOT_IN_A_GAME",
    ALIVE = "ALIVE",
    MAYBE_ALIVE = "MAYBE_ALIVE",
    DEAD = "DEAD",
}

const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

function minimuSpawnTime(deathTime: number) {
    return deathTime + ROSHAN_MINIMUM_SPAWN_TIME;
}
function maximumSpawnTime(deathTime: number) {
    return deathTime + ROSHAN_MAXIMUM_SPAWN_TIME;
}
function roshHasDiedBeforeStatus(currentTime: number, deathTime: number) {
    if (currentTime < minimuSpawnTime(deathTime)) {
        return Status.DEAD;
    } else if (currentTime < maximumSpawnTime(deathTime)) {
        return Status.MAYBE_ALIVE;
    } else {
        return Status.ALIVE;
    }
}

function getStatus(
    inGame: boolean,
    currentTime: number,
    deathTime: number | undefined
): Status {
    if (inGame) {
        if (deathTime === undefined) {
            return Status.ALIVE;
        } else {
            return roshHasDiedBeforeStatus(currentTime, deathTime);
        }
    } else {
        return Status.NOT_IN_A_GAME;
    }
}

export default {
    getStatus,
    minimuSpawnTime,
    maximumSpawnTime,
};
