jest.mock("../../log");

import rule from "../stopAudio";

const mockStop = jest.fn();

describe("stopAudio", () => {
    describe("true", () => {
        let results: any;
        beforeEach(() => {
            results = getResults(rule, {
                stopAudio: true,
                discordSubscriptionTopic: {
                    player: {
                        stop: mockStop,
                    },
                },
            }) as any;
        });
        test("reset state", () => {
            expect(results).toContainFact("stopAudio", undefined);
        });
        test("play audio resource", () => {
            expect(mockStop).toHaveBeenCalledTimes(1);
        });
    });
    describe("false", () => {
        let results: any;
        beforeEach(() => {
            results = getResults(rule, {
                stopAudio: false,
                discordSubscriptionTopic: {
                    player: {
                        stop: mockStop,
                    },
                },
            }) as any;
        });
        test("reset state", () => {
            expect(results).toContainFact("stopAudio", undefined);
        });
        test("play audio resource", () => {
            expect(mockStop).not.toHaveBeenCalled();
        });
    });
});
