import Event, { EventType } from "../../gsi-data-classes/Event";
import { getResults } from "../../__tests__/helpers";
import roshanRules from "../roshan";
import rules from "../../rules";

const killedRule = roshanRules.find(
    (rule) => rule.label === rules.assistant.roshan.killedEvent
)!;
const maybeAliveRule = roshanRules.find(
    (rule) => rule.label === rules.assistant.roshan.maybeAliveTime
)!;
const aliveRule = roshanRules.find(
    (rule) => rule.label === rules.assistant.roshan.aliveTime
)!;

describe("roshan", () => {
    describe("events", () => {
        describe("roshan killed", () => {
            let roshKilledState: any;

            beforeEach(() => {
                roshKilledState = getResults(killedRule, {
                    time: 100,
                    events: [new Event(EventType.RoshanKilled, 200)],
                }) as any;
            });

            test("play maybe audio 8 minutes from now", () => {
                const results = getResults(
                    maybeAliveRule,
                    {
                        roshan: "PUBLIC",
                        time: 100 + 8 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playDiscordAudio",
                    "resources/audio/rosh-maybe.mp3"
                );
            });

            test("play alive audio 11 minutes from now", () => {
                const results = getResults(
                    aliveRule,
                    {
                        roshan: "PUBLIC",
                        time: 100 + 11 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playDiscordAudio",
                    "resources/audio/rosh-alive.mp3"
                );
            });
        });
    });
});
