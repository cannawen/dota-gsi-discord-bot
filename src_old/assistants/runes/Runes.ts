import broker from "../../broker";
import Constants from "./Constants";
import timeToRuneIdBitmap from "./logic";
import Topic from "../../../src/topics";

export default class Runes {
    public handleTime(time: number): string | null | undefined {
        if (time > Constants.Time.GAME_START_TIME) {
            const audioKey = timeToRuneIdBitmap(
                time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN
            );
            return Constants.Audio[audioKey];
        }
    }
}

const component = new Runes();
broker.register(
    "ASSISTANT/RUNES",
    Topic.DOTA_2_TIME,
    Topic.EFFECT_PLAY_FILE,
    component.handleTime.bind(component)
);
