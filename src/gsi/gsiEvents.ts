import { engine, Fact, Topic } from "../Engine";
import Event from "../Event";
import topic from "../topics";

// Note: right now events may overwrite each other if they have the same eventType and gameTime
// 4 players grabbing 4 bounty runes at the same time will only count as 1 event
// `allEvents` contains an array of all events seen so far

const allEventsTopic = new Topic<Event[] | undefined>("allEvents");

const neverSeenBefore = (allEvents: Event[], newEvent: Event): boolean => {
    return !allEvents.reduce(
        (haveSeenBefore, existingEvent) =>
            Event.same(existingEvent, newEvent) || haveSeenBefore,
        false
    );
};

engine.register("gsi/events/new", [topic.gsiData], (db) => {
    const events = db.get(topic.gsiData).events;
    if (events !== null && events.length > 0) {
        const allEvents = db.get(allEventsTopic) || [];
        const newEvents = db
            .get(topic.gsiData)
            .events?.map(Event.create)
            .filter((event) => neverSeenBefore(allEvents, event));

        if (newEvents && newEvents.length > 0) {
            return [
                new Fact(allEventsTopic, allEvents.concat(newEvents)),
                new Fact(topic.events, newEvents),
            ];
        } else {
            return [new Fact(topic.events, undefined)];
        }
    }
});

engine.register("gsi/events/reset_all", [topic.inGame], (db) => {
    if (!db.get(topic.inGame)) {
        return [new Fact(allEventsTopic, [])];
    }
});
