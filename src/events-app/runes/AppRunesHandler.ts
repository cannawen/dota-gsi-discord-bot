import Constants from "./Constants";
import {
    IGsiTimeSubscriber,
} from "../IGsiConsumers";
import sideEffect from "../../SideEffect";
import timeToRuneIdBitmap from "./logic";

export default class AppRunesHandler implements IGsiTimeSubscriber {
    public handleTime(time: number) {
        if (time > Constants.Time.GAME_START_TIME) {
            const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);
            const audioFileName = Constants.Audio[audioKey];

            if (audioFileName) {
                return {
                    data: audioFileName,
                    type: sideEffect.Type.AUDIO_FILE,
                };
            }
        }

        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }
}
