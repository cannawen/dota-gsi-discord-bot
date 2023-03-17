import {
    IGsiEventsObserver,
    IGsiGameStateObserver,
} from "../IGsiObservers";
import gsi from "node-gsi";
import GsiSubject from "./GsiSubject";
import log from "../log";
import SideEffect from "../SideEffect";

function sameGSIEvent(event1: gsi.IEvent, event2: gsi.IEvent) {
    return event1.gameTime === event2.gameTime
        && event1.eventType === event2.eventType;
}

// TODO remove nodeGsi.IEvent dependency by turning into plain object
export default class GsiEventsSubject extends GsiSubject implements IGsiGameStateObserver {
    protected subscribers : IGsiEventsObserver[] = [];

    // Note: right now events may overwrite each other if they have the same eventType and gameTime
    // 4 players grabbing 4 bounty runes at the same time will only count as 1 event
    // `allEvents` contains an array of all events seen so far
    private allEvents: gsi.IEvent[] = [];

    public inGame(newInGame: boolean) {
        if (!newInGame) {
            this.allEvents = [];
        }
        return {
            data: null,
            type: SideEffect.Type.NONE,
        };
    }

    private neverSeenBefore(newEvent : gsi.IEvent) : boolean {
        return !this.allEvents
            .reduce(
                (haveSeenBefore, existingEvent) => sameGSIEvent(existingEvent, newEvent) || haveSeenBefore,
                false
            );
    }

    private handle(events: gsi.IEvent[]) {
        events.map((newEvent) => {
            if (this.neverSeenBefore(newEvent)) {
                this.allEvents.push(newEvent);
                this.subscribers
                    // note this event.gameTime is not equal to map.gameTime; it is offset by a specific amount per game
                    .map((handler) => handler.handleEvent(newEvent.eventType, newEvent.gameTime))
                    .map(({
                        data,
                        type,
                    }) => SideEffect.create(type, data).execute());
            }
        });
    }

    public handleState(state: gsi.IDota2State | gsi.IDota2ObserverState): void {
        if (state.events) {
            log.gsi.debug("events %s", state.events);
            this.handle(state.events);
        }
    }
}
