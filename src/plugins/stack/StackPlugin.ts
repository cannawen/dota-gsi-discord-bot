import SideEffectInfo, {
    Type,
} from "../../SideEffectInfo";
import {
    IGsiTimeObserver,
} from "../../IGsiObservers";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class StackPlugin implements IGsiTimeObserver {
    public handleTime(time: number) : SideEffectInfo | void {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return new SideEffectInfo(Type.AUDIO_FILE, "stack.wav");
        }
    }
}
