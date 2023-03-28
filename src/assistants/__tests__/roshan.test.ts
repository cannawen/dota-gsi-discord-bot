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
    describe("events", () => {
        describe("roshan killed", () => {
            test("set reminders 8 and 11 minutes from now", () => {
                const results = getResults(killedRule, {
                    time: 100,
                    events: [new Event(EventType.RoshanKilled, 200)],
                });
                expect(results).toContainFact(
                    "roshanMaybeTimeTopic",
                    100 + 8 * 60
                );
                expect(results).toContainFact(
                    "roshanAliveTimeTopic",
                    100 + 11 * 60
                );
            });
        });

        describe("bounty rune picked up", () => {
            test("do nothing", () => {
                const results = getResults(killedRule, {
                    time: 100,
                    events: [new Event(EventType.BountyRunePickup, 200)],
                });
                expect(results).toBeUndefined();
            });
        });
    });

    describe("roshan maybe time", () => {
        test("maybe time not set - do nothing", () => {
            const results = getResults(maybeAliveRule, {
                time: 99,
                roshanMaybeTimeTopic: undefined,
            });
            expect(results).toBeUndefined;
        });
        test("not yet time - do nothing", () => {
            const results = getResults(maybeAliveRule, {
                time: 99,
                roshanMaybeTimeTopic: 100,
            });
            expect(results).toBeUndefined;
        });
        test("correct time - play audio and reset time", () => {
            const results = getResults(maybeAliveRule, {
                time: 100,
                roshanMaybeTimeTopic: 100,
            });
            expect(results).toContainFact(
                "playAudioFile",
                "audio/rosh-maybe.mp3"
            );
            expect(results).toContainFact("roshanMaybeTimeTopic", undefined);
        });
        test("past the correct time - play audio and reset time", () => {
            const results = getResults(maybeAliveRule, {
                time: 101,
                roshanMaybeTimeTopic: 100,
            });
            expect(results).toContainFact(
                "playAudioFile",
                "audio/rosh-maybe.mp3"
            );
            expect(results).toContainFact("roshanMaybeTimeTopic", undefined);
        });
    });

    describe("roshan alive time", () => {
        test("alive time not set - do nothing", () => {
            const results = getResults(aliveRule, {
                time: 99,
                roshanAliveTimeTopic: undefined,
            });
            expect(results).toBeUndefined;
        });
        test("not yet time - do nothing", () => {
            const results = getResults(aliveRule, {
                time: 99,
                roshanAliveTimeTopic: 100,
            });
            expect(results).toBeUndefined;
        });
        test("correct time - play audio and reset time", () => {
            const results = getResults(aliveRule, {
                time: 100,
                roshanAliveTimeTopic: 100,
            });
            expect(results).toContainFact(
                "playAudioFile",
                "audio/rosh-alive.mp3"
            );
            expect(results).toContainFact("roshanAliveTimeTopic", undefined);
        });
        test("past the correct time - play audio and reset time", () => {
            const results = getResults(aliveRule, {
                time: 101,
                roshanAliveTimeTopic: 100,
            });
            expect(results).toContainFact(
                "playAudioFile",
                "audio/rosh-alive.mp3"
            );
            expect(results).toContainFact("roshanAliveTimeTopic", undefined);
        });
    });

    describe("in game?", () => {
        test("false - reset times", () => {
            const results = getResults(resetRule, {
                inGame: false,
            });
            expect(results).toContainFact("roshanMaybeTimeTopic", undefined);
            expect(results).toContainFact("roshanAliveTimeTopic", undefined);
        });

        test("true - do nothing", () => {
            const results = getResults(resetRule, {
                inGame: true,
            });
            expect(results).toBeUndefined();
        });
    });
});
