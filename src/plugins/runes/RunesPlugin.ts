import Constants from "./Constants";
import glue from "../../glue";
import timeToRuneIdBitmap from "./logic";
import Topic from "../../Topics";

export default class RunesPlugin {
    constructor() {
        glue.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_FILE, this.handleTime);
    }
    public handleTime(time: number) : string | null | undefined {
        if (time > Constants.Time.GAME_START_TIME) {
            const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);
            return Constants.Audio[audioKey];
        }
    }
}
