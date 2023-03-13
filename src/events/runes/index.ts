import Constants from "./Constants";
import SideEffect from "../SideEffect";
import timeToRuneIdBitmap from "./logic";

export default function handler(time: number) {
    if (time <= Constants.Time.GAME_START_TIME) {
        return new SideEffect.None();
    }

    const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);

    const audioFileName = Constants.Audio[audioKey];

    if (audioFileName) {
        return new SideEffect.Audio(audioFileName);
    } else {
        return new SideEffect.None();
    }
}
