import EffectInfo from "../../EffectInfo";
import {
    IGsiTimeObserver,
} from "../../IGsiObservers";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class StackPlugin implements IGsiTimeObserver {
    public handleTime(time: number) : EffectInfo | void {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return EffectInfo.createAudioFile("stack.wav");
        }
    }
}
