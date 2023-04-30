import rule from "../tormenter";
import rules from "../../rules";

let params: any;
describe("tormenter", () => {
    beforeEach(() => {
        params = {
            [rules.assistant.tormenter]: "PUBLIC",
            inGame: true,
            time: 20 * 60,
        };
    });
    test("warn at 20 minutes", () => {
        const result = getResults(rule, params);
        expect(result).toContainAudioEffect(
            "resources/audio/tormenters-up.mp3"
        );
    });
    describe("tormenter status", () => {
        beforeEach(() => {
            params.lastDiscordUtterance = "torment status";
        });
        describe("before 20 minutes", () => {
            test("responds appropriately", () => {
                const result = getResults(rule, { ...params, time: 10 * 60 });
                expect(result).toContainAudioEffect(
                    expect.stringContaining(
                        "resources/audio/tormenter-20-minutes.mp3"
                    )
                );
            });
        });
        describe("after 20 minutes", () => {
            test("responds appropriately", () => {
                const result = getResults(rule, params);
                expect(result).toContainAudioEffect(
                    "resources/audio/tormenters-up.mp3"
                );
            });
        });
    });

    test("letting the bot know tormenter has fallen", () => {
        const fallenResult = getResults(rule, {
            ...params,
            lastDiscordUtterance: "torment has fallen",
            time: 25 * 60,
        });
        const result = getResults(
            rule,
            { ...params, lastDiscordUtterance: "torment status" },
            fallenResult
        );
        expect(result).toContainAudioEffect(
            "Tormenter is dead. Will respawn at 35 minutes"
        );
    });
});
