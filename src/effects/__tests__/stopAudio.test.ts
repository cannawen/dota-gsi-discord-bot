jest.mock("../../log");

import Fact from "../../engine/Fact";
import rule from "../stopAudio";

const mockStop = jest.fn();

describe("stopAudio", () => {
    describe("true", () => {
        let results: Fact<unknown>;
        beforeEach(() => {
            results = getResults(rule, {
                stopAudio: true,
                discordSubscriptionTopic: {
                    player: {
                        stop: mockStop,
                    },
                },
            }) as Fact<unknown>;
        });
        test("reset state", () => {
            expect(results).toContainFact("stopAudio", undefined);
        });
        test("play audio resource", () => {
            expect(mockStop).toHaveBeenCalledTimes(1);
        });
    });
    describe("false", () => {
        let results: Fact<unknown>;
        beforeEach(() => {
            results = getResults(rule, {
                stopAudio: false,
                discordSubscriptionTopic: {
                    player: {
                        stop: mockStop,
                    },
                },
            }) as Fact<unknown>;
        });
        test("reset state", () => {
            expect(results).toContainFact("stopAudio", undefined);
        });
        test("play audio resource", () => {
            expect(mockStop).not.toHaveBeenCalled();
        });
    });
});
