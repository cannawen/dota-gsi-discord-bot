import AppRoshanHandler from "./AppRoshanHandler";

// We are testing the logic twice, once here and once in logic.test
// Should we mock out logic class, or remove logic tests entirely?
describe("AppRoshanHandler", () => {
    let handler : AppRoshanHandler;

    beforeEach(() => {
        handler = new AppRoshanHandler();
    });

    describe("IGsiEventsSubscriber.handleEvent", () => {
        describe("on any event", () => {
            test("return no side effect", () => {
                handler.handleTime(0);
                expect(handler.handleEvent("roshan_killed", 0))
                    .toHaveProperty("type", "NONE");
                expect(handler.handleEvent("bounty_rune_pickup", 0))
                    .toHaveProperty("type", "NONE");
            });
        });
    });

    describe("IGsiGameStateSubscriber.inGame", () => {
        test("return no side effect", () => {
            expect(handler.inGame(true)).toHaveProperty("type", "NONE");
            expect(handler.inGame(false)).toHaveProperty("type", "NONE");
        });
    });

    describe("when roshan dies at time 0:00", () => {
        beforeEach(() => {
            handler.handleTime(0);
            handler.handleEvent("roshan_killed", 0);
        });

        describe("IGsiTimeSubscriber.handleTime", () => {
            test("time at 0:01 should return no side effect", () => {
                expect(handler.handleTime(1)).toHaveProperty("type", "NONE");
            });
            test("time at 7:59 should return no side effect", () => {
                expect(handler.handleTime(8 * 60 - 1)).toHaveProperty("type", "NONE");
            });
            test("time at 8:00 should return tts side effect that roshan might be up", () => {
                expect(handler.handleTime(8 * 60)).toHaveProperty("type", "AUDIO_FILE");
            });
            test("time at 8:01 should return no side effect, assuming it has already made a 8:00 tts", () => {
                handler.handleTime(8 * 60);
                expect(handler.handleTime(8 * 60 + 1)).toHaveProperty("type", "NONE");
            });
            test("tts should be returned as soon as possible between 8:00-11:00 after rosh death", () => {
                expect(handler.handleTime(7 * 60)).toHaveProperty("type", "NONE");
                expect(handler.handleTime(9 * 60)).toHaveProperty("type", "AUDIO_FILE");
                expect(handler.handleTime(10 * 60)).toHaveProperty("type", "NONE");
            });
            test("time at 11:00 should return tts side effect roshan is up", () => {
                expect(handler.handleTime(11 * 60)).toHaveProperty("type", "AUDIO_FILE");
            });
            test("time at 11:01 should return no side effect, assuming it has already made a 11:00 tts", () => {
                handler.handleTime(11 * 60);
                expect(handler.handleTime(11 * 60 + 1)).toHaveProperty("type", "NONE");
            });
            describe("roshan is killed again at 10:00, between 8:00-11:00", () => {
                beforeEach(() => {
                    handler.handleTime(10 * 60);
                    handler.handleEvent("roshan_killed", 10 * 60);
                });
                test("time at 11:00 should return no side effect", () => {
                    expect(handler.handleTime(11 * 60)).toHaveProperty("type", "NONE");
                });
                test("time at 18:00 and 21:00 should return tts side effect", () => {
                    expect(handler.handleTime(18 * 60)).toHaveProperty("type", "AUDIO_FILE");
                    expect(handler.handleTime(21 * 60)).toHaveProperty("type", "AUDIO_FILE");
                });
            });
        });

        describe("IGsiGameStateSubscriber.inGame", () => {
            describe("we exit the game and join a new one", () => {
                beforeEach(() => {
                    handler.inGame(false);
                    handler.inGame(true);
                });
                test("time at 8:00 should return no side effect", () => {
                    expect(handler.handleTime(8 * 60)).toHaveProperty("type", "NONE");
                });
            });
        });
    });
});
