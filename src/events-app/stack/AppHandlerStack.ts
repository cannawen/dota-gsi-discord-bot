import {
    IEventHandlerTime,
} from "../IEventHandlers";
import sideEffect from "../../SideEffect";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class AppHandlerStack implements IEventHandlerTime {
    handleTime(time: number) {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return {
                data: "stack.wav",
                type: sideEffect.Type.AUDIO_FILE,
            };
        } else {
            return {
                data: undefined,
                type: sideEffect.Type.NONE,
            };
        }
    }
}
