import Constants from "./Constants";
import SideEffect from "../SideEffect";
import logic from "./logic";

let currentTime: number;
let lastRoshanDeathTime: number;
let roshStatus: string;

function timeHandler(time: number) {
    currentTime = time;
    const newRoshStatus = logic(time, lastRoshanDeathTime);
    if (newRoshStatus !== roshStatus) {
        roshStatus = newRoshStatus;
        switch (newRoshStatus) {
        case Constants.Status.ALIVE:
            return new SideEffect.Audio("rosh-alive.mp3");
        case Constants.Status.UNKNOWN:
            return new SideEffect.Audio("rosh-maybe.mp3");
        default:
            break;
        }
    }
    return new SideEffect.None();
}

function eventHandler(eventType: string, time: number) {
    if (eventType === "roshan_killed") {
        lastRoshanDeathTime = time;
    }
    return new SideEffect.None();
}

export default {
    eventHandler,
    timeHandler,
};
