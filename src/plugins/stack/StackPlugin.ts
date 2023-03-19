import broker from "../../broker";
import Topic from "../../Topic";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

class StackPlugin {
    public handleTime(time: number) : string | void {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return "stack.wav";
        }
    }
}

const component = new StackPlugin();
broker.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_FILE, component.handleTime.bind(component));
