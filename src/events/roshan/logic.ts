/* eslint-disable no-useless-return */
enum RoshState {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
    UNKNOWN = "UNKNOWN",
}

const currentRoshState = RoshState.ALIVE;

export default {
    currentRoshState,
    RoshState,
};
