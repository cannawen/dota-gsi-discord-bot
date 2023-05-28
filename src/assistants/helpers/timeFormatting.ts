function isoTimeString(seconds: number) {
    const totalMs = seconds * 1000;
    return new Date(totalMs).toISOString().slice(11, 19);
}

function secondsToTimeString(seconds: number) {
    const hourString = isoTimeString(seconds);
    return hourString.replace(/^0/, "").replace(/^0:/, "");
}

/**
 * NOTE: This function only returns minutes and seconds
 * If the game lasts for over an hour, it will drop the "1 hour" portion of the time
 */
function secondsToTtsTimeString(seconds: number): string {
    const timeString = isoTimeString(seconds);
    const hourString = timeString.slice(0, 2);
    const minutesString = timeString.slice(3, 5);
    const secondsString = timeString.slice(6, 8).replace("00", "minutes");

    const minutes = parseInt(minutesString) + 60 * parseInt(hourString);

    return `${minutes} ${secondsString}`;
}

export default {
    secondsToTimeString,
    secondsToTtsTimeString,
};
