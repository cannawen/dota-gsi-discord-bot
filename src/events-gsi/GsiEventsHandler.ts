import {
    IGsiEventsSubscriber,
    IGsiGameStateSubscriber,
} from "../events-app/IGsiSubscribers";
import gsi from "node-gsi";
import GsiHander from "./GsiHandler";
import SideEffect from "../SideEffect";

function sameGSIEvent(event1: gsi.IEvent, event2: gsi.IEvent) {
    return event1.gameTime === event2.gameTime
        && event1.eventType === event2.eventType;
}

// TODO remove nodeGsi.IEvent dependency by turning into plain object
export default class GsiEventsHandler extends GsiHander implements IGsiGameStateSubscriber {
    protected subscribers : IGsiEventsSubscriber[] = [];

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

    public handle(events: gsi.IEvent[]) {
        events.map((newEvent) => {
            if (this.neverSeenBefore(newEvent)) {
                this.allEvents.push(newEvent);
                this.subscribers
                    .map((handler) => handler.handleEvent(newEvent.eventType, newEvent.gameTime))
                    .map(({
                        data,
                        type,
                    }) => SideEffect.create(type, data).execute());
            }
        });
    }
}
