function isoTimeString(seconds: number) {
    const totalMs = seconds * 1000;
    return new Date(totalMs).toISOString().slice(11, 19);
}

function secondsToFormatString(seconds: number, separator: string) {
    const timeString = isoTimeString(seconds);
    const hourString = timeString.slice(0, 2);
    const minutesString = timeString.slice(3, 5);
    const secondsString = timeString.slice(6, 8);

    const minutes = parseInt(minutesString) + 60 * parseInt(hourString);

    return `${minutes}${separator}${secondsString}`;
}

function secondsToMinuteString(seconds: number) {
    return secondsToFormatString(seconds, ":");
}

function secondsToTtsTimeString(seconds: number): string {
    return secondsToFormatString(seconds, " ").replace(/00$/, "minutes");
}

function nowUnix(): number {
    return Math.floor(Date.now() / 1000);
}

export default {
    nowUnix,
    secondsToMinuteString,
    secondsToTtsTimeString,
};
