import rule from "../tormenter";
import rules from "../../rules";

let params: any;
describe("tormenter", () => {
    beforeEach(() => {
        params = {
            [rules.assistant.tormenter]: "PUBLIC",
            inGame: true,
            time: 0,
            lastDiscordUtterance: "",
        };
    });
    test("warn at 20 minutes", () => {
        const result = getResults(
            rule,
            { ...params, time: 20 * 60 },
            undefined,
            true
        );
        expect(result).toContainAudioEffect(
            "resources/audio/tormenters-up.mp3"
        );
    });

    test("letting the bot know tormenter has fallen", () => {
        const fallenResult = getResults(rule, {
            ...params,
            time: 25 * 60,
            lastDiscordUtterance: "torment has fallen",
        });
        const result = getResults(
            rule,
            {
                ...params,
                time: 26 * 60,
                lastDiscordUtterance: "torment status",
            },
            fallenResult
        );
        expect(result).toContainAudioEffect(
            "Tormenter is dead. Will respawn at 35 minutes"
        );
    });

    describe("tormenter status", () => {
        describe("before 20 minutes", () => {
            test("responds appropriately", () => {
                const result = getResults(rule, {
                    ...params,
                    time: 10 * 60,
                    lastDiscordUtterance: "torment status",
                });
                expect(result).toContainAudioEffect(
                    expect.stringContaining(
                        "resources/audio/tormenter-20-minutes.mp3"
                    )
                );
            });
        });
        describe("after 20 minutes", () => {
            test("responds appropriately", () => {
                const result = getResults(rule, {
                    ...params,
                    time: 21 * 60,
                    lastDiscordUtterance: "torment status",
                });
                expect(result).toContainAudioEffect(
                    "resources/audio/tormenters-up.mp3"
                );
            });
        });

        test("trigger phrases", () => {
            [
                "what is torment status",
                "torment status",
                "whats torment time",
                "what is torment timer",
            ].map((utterance) => {
                const result = getResults(rule, {
                    ...params,
                    time: 21 * 60,
                    lastDiscordUtterance: utterance,
                });
                expect(result).toContainAudioEffect();
            });
        });
        test("non-trigger phrases", () => {
            const result = getResults(rule, {
                ...params,
                lastDiscordUtterance: "what is roshan status",
            });
            expect(result).not.toContainAudioEffect();
        });
    });
});
