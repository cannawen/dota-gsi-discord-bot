import handler from "./EventHandler";

const allEvents = [
    handler.roshan,
    handler.runes,
    handler.stack,
];
const disabledEvents = [
    handler.roshan,
    handler.stack,
];

export default class TimeHandler {
    currentTime(time: number) {
        allEvents
            .filter((event) => !disabledEvents.includes(event))
            .map((event) => event.handleTime(time).execute());
    }
}
