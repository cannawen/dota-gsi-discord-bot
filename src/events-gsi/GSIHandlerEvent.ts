import GSI = require("node-gsi");
import handler from "../events-app/eventHandlers";

function sameGSIEvent(event1: GSI.IEvent, event2: GSI.IEvent) {
    return event1.gameTime === event2.gameTime
        && event1.eventType === event2.eventType;
}

export default class GSIHandlerEvent {
    // reset after game ends
    allEvents: GSI.IEvent[] = [];

    handle(events: GSI.IEvent[]) {
        events.map((newEvent) => {
            if (!this.allEvents.reduce((memo, existingEvent) => sameGSIEvent(existingEvent, newEvent) || memo, false)) {
                this.allEvents.push(newEvent);

                handler.roshan.handleEvents(newEvent.eventType, newEvent.gameTime).execute();
                console.log(newEvent);
            }
        });
    }
}
