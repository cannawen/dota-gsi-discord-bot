export const enum Status {
    NOT_IN_A_GAME = "NOT_IN_A_GAME",
    ALIVE = "ALIVE",
    MAYBE_ALIVE = "MAYBE_ALIVE",
    DEAD = "DEAD",
}

const AEGIS_EXPIRY_TIME = minutesToSeconds(5);
const BASE_SPAWN_TIME = minutesToSeconds(8);
const POSSIBLE_SPAWN_INTERVAL = minutesToSeconds(3);

function minutesToSeconds(minutes: number) { 
    return minutes * 60;
}

function respawnTimerDecreaseSeconds(deathTimes: number[]) {
    const numberOfRoshansTaken = deathTimes.length;
    const deathTimerDecreaseMinutes = Math.min(3, numberOfRoshansTaken - 1);
    return minutesToSeconds(deathTimerDecreaseMinutes);
}

function aegisExpiryTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + AEGIS_EXPIRY_TIME;
}

function minimuSpawnTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + BASE_SPAWN_TIME - respawnTimerDecreaseSeconds(deathTimes);
}

function maximumSpawnTime(deathTimes: number[]) {
    return deathTimes.at(-1)! + BASE_SPAWN_TIME + POSSIBLE_SPAWN_INTERVAL - respawnTimerDecreaseSeconds(deathTimes);
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
        (100 * (currentTime - minimuSpawnTime(deathTimes))) / POSSIBLE_SPAWN_INTERVAL
    );
}

export default {
    getStatus,
    aegisExpiryTime,
    minimuSpawnTime,
    maximumSpawnTime,
    percentChanceRoshanIsAlive,
};
