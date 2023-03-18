import Constants from "./Constants";
import EffectInfo from "../../EffectInfo";
import EffectType from "../../EffectType";
import {
    IGsiTimeObserver,
} from "../../IGsiObservers";
import timeToRuneIdBitmap from "./logic";

export default class RunesPlugin implements IGsiTimeObserver {
    public handleTime(time: number) : EffectInfo | void {
        if (time > Constants.Time.GAME_START_TIME) {
            const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);
            const audioFileName = Constants.Audio[audioKey];

            if (audioFileName) {
                return new EffectInfo(EffectType.AUDIO_FILE, audioFileName);
            }
        }
    }
}
