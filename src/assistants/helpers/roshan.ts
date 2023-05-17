export const enum Status {
    NOT_IN_A_GAME = "NOT_IN_A_GAME",
    ALIVE = "ALIVE",
    MAYBE_ALIVE = "MAYBE_ALIVE",
    DEAD = "DEAD",
}

const AEGIS_EXPIRY_TIME = 5 * 60;
const MINIMUM_SPAWN_TIME = 8 * 60;
const MAXIMUM_SPAWN_TIME = 11 * 60;

function aegisExpiryTime(deathTime: number) {
    return deathTime + AEGIS_EXPIRY_TIME;
}

function minimuSpawnTime(deathTime: number) {
    return deathTime + MINIMUM_SPAWN_TIME;
}
function maximumSpawnTime(deathTime: number) {
    return deathTime + MAXIMUM_SPAWN_TIME;
}

function roshanStatusGivenTime(currentTime: number, deathTime: number) {
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
            return roshanStatusGivenTime(currentTime, deathTime);
        }
    } else {
        return Status.NOT_IN_A_GAME;
    }
}

function percentChanceRoshanIsAlive(currentTime: number, deathTime: number) {
    if (currentTime < minimuSpawnTime(deathTime)) {
        return 0;
    }
    if (currentTime > maximumSpawnTime(deathTime)) {
        return 100;
    }
    return Math.round(
        (100 * (currentTime - deathTime)) /
            (MAXIMUM_SPAWN_TIME - MINIMUM_SPAWN_TIME)
    );
}

export default {
    getStatus,
    aegisExpiryTime,
    minimuSpawnTime,
    maximumSpawnTime,
    percentChanceRoshanIsAlive,
};
