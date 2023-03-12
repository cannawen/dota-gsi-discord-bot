/* eslint-disable no-useless-return */
enum RoshState {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
    UNKNOWN = "UNKNOWN",
}

const currentRoshState = RoshState.ALIVE;

function setTime(time: number) {
    return;
}

function roshKilled() {
    return;
}

export default {
    currentRoshState,
    roshKilled,
    RoshState,
    setTime,
};
