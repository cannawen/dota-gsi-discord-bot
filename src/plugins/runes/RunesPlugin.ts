import Constants from "./Constants";
import glue from "../../glue";
import timeToRuneIdBitmap from "./logic";
import topics from "../../topics";

export default class RunesPlugin {
    public handleTime(time: number) : string | null | undefined {
        if (time > Constants.Time.GAME_START_TIME) {
            const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);
            return Constants.Audio[audioKey];
        }
    }
}

const component = new RunesPlugin();
glue.register(topics.DOTA_2_TIME, topics.EFFECT_PLAY_FILE, component.handleTime.bind(component));
