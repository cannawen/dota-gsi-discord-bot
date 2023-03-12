import Constants from "./Constants";
import timeToRuneIdBitmap from "./logic";

export default function handler(time: number): string | null {
    const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);

    const audioFileName = Constants.Audio[audioKey];

    if (audioFileName) {
        return audioFileName;
    } else {
        return null;
    }
}
