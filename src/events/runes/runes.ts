import Constants from "./Constants";
import path from "node:path";
import timeToRuneIdBitmap from "./logic";

function gameNotStartedYet(time: number) {
    return time <= Constants.Time.GAME_START_TIME;
}

export default function handler(time: number): string | null {
    if (gameNotStartedYet(time)) {
        return null;
    }

    const audioKey = timeToRuneIdBitmap(time + Constants.Time.ADVANCED_WARNING_TIME_BEFORE_RUNE_SPAWN);

    const audioFileName = Constants.Audio[audioKey];

    if (audioFileName) {
        return path.join(__dirname, "../../audio/runes", audioFileName);
    } else {
        return null;
    }
}
