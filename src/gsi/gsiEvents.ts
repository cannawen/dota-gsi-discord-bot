import deepEqual from "deep-equal";
import engine from "../customEngine";
import Event from "../gsi-data-classes/Event";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import Topic from "../engine/Topic";
import topics from "../topics";
import rules from "../rules";

/**
 * Note: right now events may overwrite each other if they have the same eventType and gameTime
 * 4 players grabbing 4 bounty runes at the same time will only count as 1 event
 * `allEventsTopic` contains an array of all events seen so far
 */
const allEventsTopic = new Topic<Event[] | undefined>("allEventsTopic");

const neverSeenBefore = (allEvents: Event[], newEvent: Event): boolean =>
    !allEvents.reduce(
        (haveSeenBefore, existingEvent) =>
            deepEqual(existingEvent, newEvent) || haveSeenBefore,
        false
    );

export default [
    new Rule(rules.gsi.events.new, [topics.gsi.allData], (get) => {
        // Events from gsi server last for about 10 seconds
        // But we want to debounce events for our app
        // And only send unique events downstream
        const events = get(topics.gsi.allData)!.events;
        if (events && events.length > 0) {
            const allEvents = get(allEventsTopic) || [];
            // Filter GSI events for new events we have never seen before
            const newEvents = events
                .map(Event.create)
                .filter((event) => neverSeenBefore(allEvents, event));

            // If there is a new event we have not seen before
            if (newEvents.length > 0) {
                // Add it to allEventsTopic and return it as a new topics.event
                return [
                    new Fact(allEventsTopic, allEvents.concat(newEvents)),
                    new Fact(topics.gsi.events, newEvents),
                ];
            } else {
                // Reset topics.event
                return new Fact(topics.gsi.events, undefined);
            }
        }
    }),

    // If we are no longer in a game, reset all events
    new Rule(rules.gsi.events.reset, [topics.gsi.inGame], (get) => {
        if (!get(topics.gsi.inGame)!) {
            return new Fact(allEventsTopic, undefined);
        }
    }),
];
