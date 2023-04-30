import deepEqual from "deep-equal";
import Event from "../gsi-data-classes/Event";
import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

/**
 * Note: right now events may overwrite each other if they have the same eventType and gameTime
 * 4 players grabbing 4 bounty runes at the same time will only count as 1 event
 * `allEventsTopic` contains an array of all events seen so far
 */
const allEventsTopic = topicManager.createTopic<Event[]>("allEventsTopic", {
    defaultValue: [],
    persistAcrossRestarts: true,
});

const neverSeenBefore = (allEvents: Event[], newEvent: Event): boolean =>
    !allEvents.reduce(
        (haveSeenBefore, existingEvent) =>
            deepEqual(existingEvent, newEvent) || haveSeenBefore,
        false
    );

export default new Rule({
    label: rules.gsi.events.new,
    trigger: [topics.allData],
    given: [allEventsTopic],
    then: ([data], [allEvents]) => {
        // Events from gsi server last for about 10 seconds
        // But we want to debounce events for our app
        // And only send unique events downstream
        const events = (data as GsiData).events;
        if (events && events.length > 0) {
            // Filter GSI events for new events we have never seen before
            const newEvents = events
                .map(Event.create)
                .filter((event) => neverSeenBefore(allEvents, event));

            // If there is a new event we have not seen before
            if (newEvents.length > 0) {
                // Add it to allEventsTopic and return it as a new topics.event
                return [
                    new Fact(allEventsTopic, allEvents.concat(newEvents)),
                    new Fact(topics.events, newEvents),
                ];
            } else {
                // Reset topics.event
                return new Fact(topics.events, undefined);
            }
        }
    },
});
