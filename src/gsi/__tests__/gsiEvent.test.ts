import { EventType, IEvent } from "node-gsi";
import Event from "../../gsi-data-classes/Event";
import GsiData from "../GsiData";
import rule from "../gsiEvents";

describe("gsi event parsing", () => {
    test("events", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                events: [
                    {
                        eventType: EventType.BountyRunePickup,
                        gameTime: 10,
                    } as IEvent,
                ],
            }),
        }) as any;
        expect(results).toContainFact("allEventsTopic", [
            new Event(EventType.BountyRunePickup as any, 10),
        ]);
        expect(results).toContainFact("events", [
            new Event(EventType.BountyRunePickup as any, 10),
        ]);

        const newEventResults = getResults(
            rule,
            {
                allData: new GsiData({
                    events: [
                        {
                            eventType: EventType.RoshanKilled,
                            gameTime: 100,
                        } as IEvent,
                        {
                            eventType: EventType.AegisPickedUp,
                            gameTime: 101,
                        } as IEvent,
                    ],
                }),
            },
            results
        );
        expect(newEventResults).toContainFact("allEventsTopic", [
            new Event(EventType.BountyRunePickup as any, 10),
            new Event(EventType.RoshanKilled as any, 100),
            new Event(EventType.AegisPickedUp as any, 101),
        ]);
        expect(newEventResults).toContainFact("events", [
            new Event(EventType.RoshanKilled as any, 100),
            new Event(EventType.AegisPickedUp as any, 101),
        ]);
    });
});
