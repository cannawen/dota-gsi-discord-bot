import Constants from "./Constants";

// return type string is actually a enum Constants.RoshStatus type ... how to tell this to typescript?
export default function timeAndRoshDeathTimeToRoshStatus(
    time: number,
    lastRoshDeathTime: number | undefined
): string {
    if (lastRoshDeathTime === undefined) {
        return Constants.Status.ALIVE;
    }
    const roshHasBeenDeadFor = time - lastRoshDeathTime;
    if (roshHasBeenDeadFor < Constants.RespawnTime.MINIMUM) {
        return Constants.Status.DEAD;
    } else if (roshHasBeenDeadFor >= Constants.RespawnTime.MAXIMUM) {
        return Constants.Status.ALIVE;
    } else {
        return Constants.Status.UNKNOWN;
    }
}
