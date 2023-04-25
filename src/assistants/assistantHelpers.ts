/**
 * NOTE: This function only returns minutes and seconds
 * If the game lasts for over an hour, it will drop the "1 hour" portion of the time
 */
function secondsToTimeString(seconds: number) {
    const totalMs = seconds * 1000;

    const minutesAndSeconds = new Date(totalMs).toISOString().slice(14, 19);

    const removeLeadingZero = minutesAndSeconds.replace(/^0/, "");
    const timeStringWithSpaces = removeLeadingZero.replace(":", " ");

    return timeStringWithSpaces;
}

class NeutralItemHelper {
    public spawnMinutes = [7, 17, 27, 37, 60];
}

export default {
    neutral: new NeutralItemHelper(),
    secondsToTimeString,
};
