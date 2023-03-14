import {
    SideEffectAudio,
    SideEffectNone,
} from "../../SideEffect";
import {
    IEventHandlerTime,
} from "../IEventHandlers";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class AppHandlerStack implements IEventHandlerTime {
    handleTime(time: number) {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return new SideEffectAudio("stack.wav");
        } else {
            return new SideEffectNone();
        }
    }
}
