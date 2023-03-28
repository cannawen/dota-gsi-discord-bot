import Event, { EventType } from "../../gsi-data-classes/Event";
import { getResults } from "../../__tests__/helpers";
import roshanRules from "../roshan";

const killedRule = roshanRules.find(
    (rule) =>
        rule.label === "assistant/roshan/killed_event/set_future_audio_state"
)!;
const maybeAliveRule = roshanRules.find(
    (rule) => rule.label === "assistant/roshan/maybe_alive_time/play_audio"
)!;
const aliveRule = roshanRules.find(
    (rule) => rule.label === "assistant/roshan/alive_time/play_audio"
)!;
const resetRule = roshanRules.find(
    (rule) => rule.label === "assistant/roshan/reset"
)!;

describe("roshan", () => {
    describe("roshan killed event", () => {
        test("set reminders 8 and 11 minutes from now", () => {
            const results = getResults(killedRule, {
                time: 100,
                events: [new Event(EventType.RoshanKilled, 200)],
            });
            expect(results).toContainFact("roshanMaybeTimeTopic", 100 + 8 * 60);
            expect(results).toContainFact(
                "roshanAliveTimeTopic",
                100 + 11 * 60
            );
        });
    });

    describe("bounty rune picked up event", () => {
        test("set reminders 8 and 11 minutes from now", () => {
            const results = getResults(killedRule, {
                time: 100,
                events: [new Event(EventType.BountyRunePickup, 200)],
            });
            expect(results).toBeUndefined();
        });
    });
});
