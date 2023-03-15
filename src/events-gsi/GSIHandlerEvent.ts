import GSI = require("node-gsi");
import handler from "../events-app/eventHandlers";
import sideEffect from "../SideEffect";

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

                console.log(newEvent);

                // events.gameTime start 258 seconds earlier than our map.gameTime for unknown reasons
                const effect = handler.roshan.handleEvent(newEvent.eventType, newEvent.gameTime - 258);
                console.log("data from event handler");
                console.log(effect);
                sideEffect.create(effect.type, effect.data).execute();
            }
        });
    }
}
