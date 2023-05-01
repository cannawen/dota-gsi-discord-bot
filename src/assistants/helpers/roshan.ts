export const enum Status {
    INVALID = "INVALID",
    ALIVE = "ALIVE",
    MAYBE_ALIVE = "MAYBE_ALIVE",
    DEAD = "DEAD",
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
            const timeElapsedSinceDeath = currentTime - deathTime;
            if (timeElapsedSinceDeath < 8 * 60) {
                return Status.DEAD;
            } else if (timeElapsedSinceDeath < 11 * 60) {
                return Status.MAYBE_ALIVE;
            } else {
                return Status.ALIVE;
            }
        }
    } else {
        return Status.INVALID;
    }
}

export default {
    getStatus,
};
