import AppLogic from "../AppLogic";
import {
    IGsiTimeObserver,
} from "../../IGsiObservers";
import sideEffect from "../../SideEffect";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class AppStackLogic extends AppLogic implements IGsiTimeObserver {
    public handleTime(time: number) {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return {
                data: "stack.wav",
                type: sideEffect.Type.AUDIO_FILE,
            };
        } else {
            return {
                data: null,
                type: sideEffect.Type.NONE,
            };
        }
    }
}
