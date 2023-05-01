function secondsToTimeString(seconds: number) {
    const totalMs = seconds * 1000;
    const hourString = new Date(totalMs).toISOString().slice(11, 19);
    return hourString.replace(/^0/, "").replace(/^0:/, "");
}

/**
 * NOTE: This function only returns minutes and seconds
 * If the game lasts for over an hour, it will drop the "1 hour" portion of the time
 */
function secondsToTtsTimeString(seconds: number): string {
    const minutesOnlyTimeString = secondsToTimeString(seconds).slice(-5);
    return minutesOnlyTimeString
        .replace(/^0/, "")
        .replace(/:00$/, " minutes")
        .replace(":", " ");
}

export default {
    secondsToTimeString,
    secondsToTtsTimeString,
};
