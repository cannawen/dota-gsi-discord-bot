import sut from "../time";

describe("time helpers", () => {
    describe("seconds to time string", () => {
        test("it formats properly", () => {
            expect(sut.secondsToMinuteString(0)).toBe("0:00");
            expect(sut.secondsToMinuteString(60 * 60)).toBe("60:00");
        });
    });
    describe("seconds to TTS time string", () => {
        test("removes colon", () => {
            expect(sut.secondsToTtsTimeString(10 * 60 + 5)).toBe("10 05");
        });
        test("removes leading 0", () => {
            expect(sut.secondsToTtsTimeString(1)).toBe("0 01");
        });
        test("turns :00 seconds into minutes string", () => {
            expect(sut.secondsToTtsTimeString(10 * 60)).toBe("10 minutes");
        });

        test("turns hour into 60 minutes", () => {
            expect(sut.secondsToTtsTimeString(70 * 60 + 30)).toBe("70 30");
        });
    });
});
