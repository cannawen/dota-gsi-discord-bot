import GSI = require("node-gsi");
import handler from "../events-app/eventHandlers";

const allEvents = [
    handler.roshan,
];
const disabledEvents = [
];

function sameEvent(event1: GSI.IEvent, event2: GSI.IEvent) {
    return event1.gameTime === event2.gameTime
        && event1.eventType === event2.eventType;
}

export default class GSIHandlerEvent {
    allEvents: GSI.IEvent[] = [];

    handle(events: GSI.IEvent[]) {
        events.map((newEvent) => {
            if (!this.allEvents.reduce((memo, existingEvent) => sameEvent(existingEvent, newEvent) || memo, false)) {
                this.allEvents.push(newEvent);
            }
        });
    }
}
