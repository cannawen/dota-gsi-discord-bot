import {
    IGsiEventsObserver,
    IGsiGameStateObserver,
} from "../IGsiObservers";
import SideEffectInfo, {
    Type,
} from "../SideEffectInfo";
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
    protected observers : IGsiEventsObserver[] = [];

    // Note: right now events may overwrite each other if they have the same eventType and gameTime
    // 4 players grabbing 4 bounty runes at the same time will only count as 1 event
    // `allEvents` contains an array of all events seen so far
    private allEvents: gsi.IEvent[] = [];

    public inGame(newInGame: boolean) : SideEffectInfo {
        if (!newInGame) {
            this.allEvents = [];
        }
        return SideEffectInfo.none();
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
                this.observers
                    // note this event.gameTime is not equal to map.gameTime; it is offset by a specific amount per game
                    .map((observer) => observer.handleEvent(newEvent.eventType, newEvent.gameTime)) // notify all observers we have a new event
                    .map((info) => SideEffect.create(info)) // create a side effect from the side effect info
                    .map((sideEffect) => sideEffect.execute()); // execute that side effect - this doesn't belong here
            }
        });
    }

    public handleState(state: gsi.IDota2State | gsi.IDota2ObserverState): void {
        if (state.events) {
            log.gsiEvents.debug("events %s", state.events);
            this.handle(state.events);
        }
    }
}
