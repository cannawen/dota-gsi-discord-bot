import { Fact, Topic } from "../Engine";
import deepEqual from "deep-equal";
import engine from "../customEngine";
import Event from "../Event";
import topics from "../topics";

// Note: right now events may overwrite each other if they have the same eventType and gameTime
// 4 players grabbing 4 bounty runes at the same time will only count as 1 event
// `allEvents` contains an array of all events seen so far

const allEventsTopic = new Topic<Event[] | undefined>("allEvents");

const neverSeenBefore = (allEvents: Event[], newEvent: Event): boolean => {
    return !allEvents.reduce(
        (haveSeenBefore, existingEvent) =>
            deepEqual(existingEvent, newEvent) || haveSeenBefore,
        false
    );
};

engine.register("gsi/events/new", [topics.gsiData], (get) => {
    const events = get(topics.gsiData).events;
    if (events !== null && events.length > 0) {
        const allEvents = get(allEventsTopic) || [];
        const newEvents = events
            .map(Event.create)
            .filter((event) => neverSeenBefore(allEvents, event));

        if (newEvents && newEvents.length > 0) {
            return [
                new Fact(allEventsTopic, allEvents.concat(newEvents)),
                new Fact(topics.events, newEvents),
            ];
        } else {
            return new Fact(topics.events, undefined);
        }
    }
});

engine.register("gsi/events/reset_all", [topics.inGame], (get) => {
    if (!get(topics.inGame)) {
        return new Fact(allEventsTopic, []);
    }
});
