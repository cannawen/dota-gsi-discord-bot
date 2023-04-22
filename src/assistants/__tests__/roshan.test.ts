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
const voiceRule = roshanRules.find(
    (rule) => rule.label === rules.assistant.roshan.voice
)!;

describe("roshan", () => {
    describe("not asking about rosh", () => {
        test("voice should return nothing", () => {
            const results = getResults(voiceRule, {
                Roshan: "PUBLIC",
                inGame: true,
                lastDiscordUtterance: "The sky is blue",
            });
            expect(results).toBeUndefined();
        });
    });

    describe("asking about rosh", () => {
        test("voice should return roshan is alive", () => {
            const results = getResults(voiceRule, {
                Roshan: "PUBLIC",
                inGame: true,
                time: 1,
                lastDiscordUtterance: "What's roshan timer",
            });
            expect(results).toContainFact(
                "playPublicAudio",
                expect.stringContaining("Roshan is alive")
            );
        });
        describe("roshan killed", () => {
            let roshKilledState: any;

            beforeEach(() => {
                roshKilledState = getResults(killedRule, {
                    time: 100,
                    inGame: true,
                    events: [new Event(EventType.RoshanKilled, 200)],
                }) as any;
            });

            test("voice should say rosh is dead & aegis reminder until 5:00 after killed event", () => {
                const results = getResults(
                    voiceRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        lastDiscordUtterance: "what time",
                        time: 100 + 4 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    expect.stringContaining("Roshan is dead. Aegis expires at")
                );
            });

            test("voice should say rosh is dead & respawn reminder until 8:00 after killed event", () => {
                const results = getResults(
                    voiceRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        lastDiscordUtterance: "what time",
                        time: 100 + 7 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    expect.stringContaining("Roshan is dead. May respawn at")
                );
            });

            test("play maybe audio 8 minutes from now", () => {
                const results = getResults(
                    maybeAliveRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        time: 100 + 8 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    "resources/audio/rosh-maybe.mp3"
                );
            });

            test("voice should say rosh may be alive & respawn reminder until 11:00 after killed event", () => {
                const results = getResults(
                    voiceRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        lastDiscordUtterance: "what status",
                        time: 100 + 10 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    expect.stringContaining(
                        "Roshan may be alive. Guaranteed respawn at"
                    )
                );
            });

            test("play alive audio 11 minutes from now", () => {
                const results = getResults(
                    aliveRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        time: 100 + 11 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    "resources/audio/rosh-alive.mp3"
                );
            });

            test("voice should say rosh is alive 11:00 after killed event", () => {
                const results = getResults(
                    voiceRule,
                    {
                        Roshan: "PUBLIC",
                        inGame: true,
                        lastDiscordUtterance: "Whats roshan time",
                        time: 100 + 12 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainFact(
                    "playPublicAudio",
                    expect.stringContaining("Roshan is alive")
                );
            });
        });
    });
});
