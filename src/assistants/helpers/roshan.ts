export const enum Status {
    NOT_IN_A_GAME = "NOT_IN_A_GAME",
    ALIVE = "ALIVE",
    MAYBE_ALIVE = "MAYBE_ALIVE",
    DEAD = "DEAD",
}

const AEGIS_EXPIRY_TIME = 5 * 60;
const MINIMUM_SPAWN_TIME = 8 * 60;
const MAXIMUM_SPAWN_TIME = 11 * 60;

function respawnTimerDecreaseSeconds(deathTimes: number[]) {
    return Math.min(3, (deathTimes.length - 1)) * 60;
}

function aegisExpiryTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + AEGIS_EXPIRY_TIME;
}

function minimuSpawnTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + MINIMUM_SPAWN_TIME - respawnTimerDecreaseSeconds(deathTimes);
}
function maximumSpawnTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + MAXIMUM_SPAWN_TIME - respawnTimerDecreaseSeconds(deathTimes);
}

function roshanStatusGivenTime(currentTime: number, deathTimes: number[]) {
    if (currentTime < minimuSpawnTime(deathTimes)!) {
        return Status.DEAD;
    } else if (currentTime < maximumSpawnTime(deathTimes)!) {
        return Status.MAYBE_ALIVE;
    } else {
        return Status.ALIVE;
    }
}

function getStatus(
    inGame: boolean,
    currentTime: number,
    deathTimes: number[]
): Status {
    if (inGame) {
        if (deathTimes === undefined) {
            return Status.ALIVE;
        } else {
            return roshanStatusGivenTime(currentTime, deathTimes);
        }
    } else {
        return Status.NOT_IN_A_GAME;
    }
}

function percentChanceRoshanIsAlive(currentTime: number, deathTimes: number[]) {
    if (currentTime < minimuSpawnTime(deathTimes)!) {
        return 0;
    }
    if (currentTime > maximumSpawnTime(deathTimes)) {
        return 100;
    }
    return Math.round(
        (100 * (currentTime - minimuSpawnTime(deathTimes))) /
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
