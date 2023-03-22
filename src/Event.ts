import gsi from "node-gsi";

export default class Event {
    type: string;
    time: number;

    // Events using "game time" which is different than "clock time"
    // In the rest of the app we are using "clock_time"
    constructor(type: string, time: number) {
        this.type = type;
        this.time = time;
    }

    static create(event: gsi.IEvent) {
        return new Event(event.eventType, event.gameTime);
    }

    static same(event1: Event, event2: Event) {
        return event1.time === event2.time && event1.type === event2.type;
    }
}
