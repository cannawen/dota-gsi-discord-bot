import sideEffect from "../../SideEffect";
import Constants from "./Constants";
import {
    IEventHandlerTime,
} from "../IEventHandlers";
import timeToRuneIdBitmap from "./logic";

export default class AppHandlerRunes implements IEventHandlerTime {
    handleTime(time: number) {
        if (time <= Constants.Time.GAME_START_TIME) {
            return {
                data: undefined,
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
                data: undefined,
                type: sideEffect.Type.NONE,
            };
        }
    }
}
