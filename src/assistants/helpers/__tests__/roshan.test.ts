import sut, { Status } from "../roshan";
describe("roshan helper", () => {
    describe("state given death time and current time", () => {
        test("Not in a game", () => {
            expect(sut.getStatus(false, 0, 0)).toBe(Status.NOT_IN_A_GAME);
        });
        describe("in a game", () => {
            test("Never killed before returns", () => {
                expect(sut.getStatus(true, 0, undefined)).toBe(Status.ALIVE);
            });
            test("Killed < 8 minutes ago", () => {
                expect(sut.getStatus(true, 0, 0)).toBe(Status.DEAD);
                expect(sut.getStatus(true, 8 * 60 - 1 + 1000, 1000)).toBe(
                    Status.DEAD
                );
            });
            test("Killed 8-11 minutes ago", () => {
                expect(sut.getStatus(true, 8 * 60, 0)).toBe(Status.MAYBE_ALIVE);
                expect(sut.getStatus(true, 11 * 60 - 1 + 1000, 1000)).toBe(
                    Status.MAYBE_ALIVE
                );
            });
            test("Killed 11 or more minutes ago", () => {
                expect(sut.getStatus(true, 11 * 60, 0)).toBe(Status.ALIVE);
                expect(sut.getStatus(true, 60 * 60, 0)).toBe(Status.ALIVE);
            });
        });
    });
});
