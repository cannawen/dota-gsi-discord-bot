import broker from "../broker";
import Event from "../Event";
import gsi from "node-gsi";
import log from "../log";
import Topic from "../Topic";

class GsiEvents {
    // Note: right now events may overwrite each other if they have the same eventType and gameTime
    // 4 players grabbing 4 bounty runes at the same time will only count as 1 event
    // `allEvents` contains an array of all events seen so far
    private allEvents: Event[] = [];

    public inGame(newInGame: boolean) : void {
        if (!newInGame) {
            this.allEvents = [];
        }
    }

    private neverSeenBefore(newEvent : Event) : boolean {
        return !this.allEvents
            .reduce(
                (haveSeenBefore, existingEvent) => Event.same(existingEvent, newEvent) || haveSeenBefore,
                false
            );
    }

    public handleState(state: gsi.IDota2State | gsi.IDota2ObserverState): Event[] | void {
        if (state.events) {
            log.debug("gsi", "events %s", state.events);
            let added = false;
            state.events
                .map(Event.create)
                .map((event) => {
                    if (this.neverSeenBefore(event)) {
                        added = true;
                        this.allEvents.push(event);
                    }
                });
            if (added) {
                return this.allEvents;
            }
        }
    }
}

const component = new GsiEvents();
broker.register("GSI/EVENTS/EVENTS", Topic.GSI_DATA_LIVE, Topic.DOTA_2_EVENTS, component.handleState.bind(component));
broker.register("GSI/EVENTS/EVENTS", Topic.GSI_DATA_OBSERVER, Topic.DOTA_2_EVENTS, component.handleState.bind(component));
broker.register("GSI/EVENTS/GAME_STATE", Topic.DOTA_2_GAME_STATE, null, component.inGame.bind(component));
