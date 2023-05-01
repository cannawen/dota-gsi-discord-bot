import Event, { EventType } from "../../gsi-data-classes/Event";
import Fact from "../../engine/Fact";
import roshanRules from "../roshan";

const params = {
    Roshan: "PUBLIC",
    inGame: true,
    time: 100,
    dayTime: true,
    events: [],
    lastDiscordUtterance: "",
};

describe("roshan", () => {
    describe("not asking about rosh", () => {
        test("bot should not respond", () => {
            const results = getResults(roshanRules, {
                ...params,
                lastDiscordUtterance: "The sky is blue",
            });
            expect(results).not.toContainAudioEffect();
        });
        test("bot should not respond to torment questions", () => {
            const results = getResults(roshanRules, {
                ...params,
                lastDiscordUtterance: "what is torment status",
            });
            expect(results).not.toContainAudioEffect();
        });
    });

    describe("asking about rosh", () => {
        test("bot should respond roshan has never been killed", () => {
            const results = getResults(roshanRules, {
                ...params,
                lastDiscordUtterance: "What's roshan timer",
            });
            expect(results).toContainAudioEffect(
                "Roshan has not been killed yet"
            );
        });
        describe("roshan killed", () => {
            let roshKilledState: Fact<unknown>[];

            beforeEach(() => {
                roshKilledState = getResults(roshanRules, {
                    ...params,
                    events: [new Event(EventType.RoshanKilled, 200)],
                });
            });

            test("voice should say rosh is dead & aegis reminder until 5:00 after killed event", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        lastDiscordUtterance: "what time",
                        time: 100 + 4 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    expect.stringContaining("Roshan is dead. Aegis expires at")
                );
            });

            test("voice should say rosh is dead & respawn reminder until 8:00 after killed event", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        lastDiscordUtterance: "what time",
                        time: 100 + 7 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    expect.stringContaining("Roshan is dead. May respawn at")
                );
            });

            test("play maybe audio 8 minutes from now", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        time: 100 + 8 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    "resources/audio/rosh-maybe.mp3"
                );
            });

            test("voice should say rosh may be alive & respawn reminder until 11:00 after killed event", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        lastDiscordUtterance: "what status",
                        time: 100 + 10 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    expect.stringContaining(
                        "Roshan may be alive. Guaranteed respawn at"
                    )
                );
            });

            test("play alive audio 11 minutes from now", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        time: 100 + 11 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    "resources/audio/rosh-alive.mp3"
                );
            });

            test("voice should say rosh is alive 11:00 after killed event", () => {
                const results = getResults(
                    roshanRules,
                    {
                        ...params,
                        lastDiscordUtterance: "Whats roshan time",
                        time: 100 + 12 * 60,
                    },
                    roshKilledState
                );
                expect(results).toContainAudioEffect(
                    expect.stringContaining("Roshan is alive")
                );
            });
        });
    });
});
