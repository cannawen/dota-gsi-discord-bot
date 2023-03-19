import glue from "../../glue";
import Topic from "../../Topics";

const ADVANCED_WARNING_TIME_BEFORE_STACK_TIME = 20;

export default class StackPlugin {
    constructor() {
        glue.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_FILE, this.handleTime);
    }
    public handleTime(time: number) : string | void {
        if (time >= 60 && (time + ADVANCED_WARNING_TIME_BEFORE_STACK_TIME) % 60 === 0) {
            return "stack.wav";
        }
    }
}
