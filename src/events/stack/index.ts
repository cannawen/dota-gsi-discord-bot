import SideEffect from "../SideEffect";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default function handler(time: number) {
    if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
        return new SideEffect.Audio("stack.wav");
    } else {
        return new SideEffect.None();
    }
}
