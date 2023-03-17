import RoshanPlugin from "./RoshanPlugin";

// We are testing the logic twice, once here and once in logic.test
// We should mock out the logic class here
describe("RoshanPlugin", () => {
    let sut : RoshanPlugin;

    beforeEach(() => {
        sut = new RoshanPlugin();
    });

    describe("IGsiEventsObserver.handleEvent", () => {
        describe("on any event", () => {
            test("return no side effect", () => {
                sut.handleTime(0);
                expect(sut.handleEvent("roshan_killed", 0))
                    .toBeUndefined();
                expect(sut.handleEvent("bounty_rune_pickup", 0))
                    .toBeUndefined();
            });
        });
    });

    describe("IGsiGameStateObserver.inGame", () => {
        test("return no side effect", () => {
            expect(sut.inGame(true)).toBeUndefined();
            expect(sut.inGame(false)).toBeUndefined();
        });
    });

    describe("when roshan dies at time 0:00", () => {
        beforeEach(() => {
            sut.handleTime(0);
            sut.handleEvent("roshan_killed", 0);
        });

        describe("IGsiTimeObserver.handleTime", () => {
            test("time at 0:01 should return no side effect", () => {
                expect(sut.handleTime(1)).toBeUndefined();
            });
            test("time at 7:59 should return no side effect", () => {
                expect(sut.handleTime(8 * 60 - 1)).toBeUndefined();
            });
            test("time at 8:00 should return tts side effect that roshan might be up", () => {
                expect(sut.handleTime(8 * 60)).toHaveProperty("type", "AUDIO_FILE");
            });
            test("time at 8:01 should return no side effect, assuming it has already made a 8:00 tts", () => {
                sut.handleTime(8 * 60);
                expect(sut.handleTime(8 * 60 + 1)).toBeUndefined();
            });
            test("tts should be returned as soon as possible between 8:00-11:00 after rosh death", () => {
                expect(sut.handleTime(7 * 60)).toBeUndefined();
                expect(sut.handleTime(9 * 60)).toHaveProperty("type", "AUDIO_FILE");
                expect(sut.handleTime(10 * 60)).toBeUndefined();
            });
            test("time at 11:00 should return tts side effect roshan is up", () => {
                expect(sut.handleTime(11 * 60)).toHaveProperty("type", "AUDIO_FILE");
            });
            test("time at 11:01 should return no side effect, assuming it has already made a 11:00 tts", () => {
                sut.handleTime(11 * 60);
                expect(sut.handleTime(11 * 60 + 1)).toBeUndefined();
            });
            describe("roshan is killed again at 10:00, between 8:00-11:00", () => {
                beforeEach(() => {
                    sut.handleTime(10 * 60);
                    sut.handleEvent("roshan_killed", 10 * 60);
                });
                test("time at 11:00 should return no side effect", () => {
                    expect(sut.handleTime(11 * 60)).toBeUndefined();
                });
                test("time at 18:00 and 21:00 should return tts side effect", () => {
                    expect(sut.handleTime(18 * 60)).toHaveProperty("type", "AUDIO_FILE");
                    expect(sut.handleTime(21 * 60)).toHaveProperty("type", "AUDIO_FILE");
                });
            });
        });

        describe("IGsiGameStateObserver.inGame", () => {
            describe("we exit the game and join a new one", () => {
                beforeEach(() => {
                    sut.inGame(false);
                    sut.inGame(true);
                });
                test("time at 8:00 should return no side effect", () => {
                    expect(sut.handleTime(8 * 60)).toBeUndefined();
                });
            });
        });
    });
});
