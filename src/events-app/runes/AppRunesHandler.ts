import Constants from "./Constants";
import {
    IGsiTimeConsumer,
} from "../IGsiConsumers";
import sideEffect from "../../SideEffect";
import timeToRuneIdBitmap from "./logic";

export default class AppRunesHandler implements IGsiTimeConsumer {
    handleTime(time: number) {
        if (time <= Constants.Time.GAME_START_TIME) {
            return {
                data: null,
                type: sideEffect.Type.NONE,
            };
        }

        const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);

        const audioFileName = Constants.Audio[audioKey];

        if (audioFileName) {
            return {
                data: audioFileName,
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
