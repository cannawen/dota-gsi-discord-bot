import broker from "../broker";
import gsi from "node-gsi";
import log from "../log";
import Topic from "../Topic";

function sameGSIEvent(event1: gsi.IEvent, event2: gsi.IEvent) {
    return event1.gameTime === event2.gameTime
        && event1.eventType === event2.eventType;
}

class GsiEvents {
    // Note: right now events may overwrite each other if they have the same eventType and gameTime
    // 4 players grabbing 4 bounty runes at the same time will only count as 1 event
    // `allEvents` contains an array of all events seen so far
    private allEvents: gsi.IEvent[] = [];

    public inGame(newInGame: boolean) : void {
        if (!newInGame) {
            this.allEvents = [];
        }
    }

    private neverSeenBefore(newEvent : gsi.IEvent) : boolean {
        return !this.allEvents
            .reduce(
                (haveSeenBefore, existingEvent) => sameGSIEvent(existingEvent, newEvent) || haveSeenBefore,
                false
            );
    }

    private handle(events: gsi.IEvent[]) {
        let added = false;
        events.map((newEvent) => {
            if (this.neverSeenBefore(newEvent)) {
                added = true;
                this.allEvents.push(newEvent);
            }
        });
        // this is not debounced
        if (added) {
            return this.allEvents;
        }
    }

    public handleState(state: gsi.IDota2State | gsi.IDota2ObserverState): gsi.IEvent[] | void {
        if (state.events) {
            log.gsiEvents.debug("events %s", state.events);
            return this.handle(state.events);
        }
    }
}

const component = new GsiEvents();
broker.register(Topic.GSI_DATA, Topic.DOTA_2_EVENTS, component.handleState.bind(component));
broker.register(Topic.DOTA_2_GAME_STATE, null, component.inGame.bind(component));
