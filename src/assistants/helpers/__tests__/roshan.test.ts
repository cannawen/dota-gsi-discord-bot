import sut, { Status } from "../roshan";

describe("roshan helper", () => {
    describe("state given first death time and current time", () => {
        test("Not in a game", () => {
            expect(sut.getStatus(false, 0, [])).toBe(Status.NOT_IN_A_GAME);
        });
        describe("in a game", () => {
            test("Never killed before returns", () => {
                expect(sut.getStatus(true, 0, [])).toBe(Status.ALIVE);
            });
            test("Killed < 8 minutes ago", () => {
                expect(sut.getStatus(true, 1001, [1000])).toBe(Status.DEAD);
                expect(sut.getStatus(true, 8 * 60 - 1 + 1000, [1000])).toBe(
                    Status.DEAD
                );
            });
            test("Killed 8-11 minutes ago", () => {
                expect(sut.getStatus(true, 8 * 60 + 1000, [1000])).toBe(Status.MAYBE_ALIVE);
                expect(sut.getStatus(true, 11 * 60 - 1 + 1000, [1000])).toBe(
                    Status.MAYBE_ALIVE
                );
            });
            test("Killed 11 or more minutes ago", () => {
                expect(sut.getStatus(true, 11 * 60 + 1001, [1000])).toBe(Status.ALIVE);
                expect(sut.getStatus(true, 60 * 60, [1000])).toBe(Status.ALIVE);
            });
        });
    });
    
    describe("state given second death time and current time", () => {
        test("Killed < 7 minutes ago", () => {
            expect(sut.getStatus(true, 1001, [1,1000])).toBe(Status.DEAD);
            expect(sut.getStatus(true, 7 * 60 - 1 + 1000, [1,1000])).toBe(
                Status.DEAD
            );
        });
        test("Killed 7-10 minutes ago", () => {
            expect(sut.getStatus(true, 7 * 60 + 1000, [1,1000])).toBe(Status.MAYBE_ALIVE);
            expect(sut.getStatus(true, 10 * 60 - 1 + 1000, [1,1000])).toBe(
                Status.MAYBE_ALIVE
            );
        });
        test("Killed 10 or more minutes ago", () => {
            expect(sut.getStatus(true, 10 * 60 + 1000, [1,1000])).toBe(Status.ALIVE);
        });
    });
    
    describe("killed 3 times", () => {
        test("Killed < 6 minutes ago", () => {
            expect(sut.getStatus(true, 1001, [1,2,1000])).toBe(Status.DEAD);
            expect(sut.getStatus(true, 6 * 60 - 1 + 1000, [1,2,1000])).toBe(
                Status.DEAD
            );
        });
        test("Killed 6-9 minutes ago", () => {
            expect(sut.getStatus(true, 6 * 60 + 1000, [1,2,1000])).toBe(Status.MAYBE_ALIVE);
            expect(sut.getStatus(true, 9 * 60 - 1 + 1000, [1,2,1000])).toBe(
                Status.MAYBE_ALIVE
            );
        });
        test("Killed 9 or more minutes ago", () => {
            expect(sut.getStatus(true, 9 * 60 + 1000, [1,2,1000])).toBe(Status.ALIVE);
        });
    });
    
    describe("killed 4+ times", () => {
        test("Killed < 5 minutes ago", () => {
            expect(sut.getStatus(true, 1001, [1,2,3,4,1000])).toBe(Status.DEAD);
            expect(sut.getStatus(true, 5 * 60 - 1 + 1000, [1,2,3,4,1000])).toBe(
                Status.DEAD
            );
        });
        test("Killed 5-8 minutes ago", () => {
            expect(sut.getStatus(true, 5 * 60 + 1000, [1,2,3,4,1000])).toBe(Status.MAYBE_ALIVE);
            expect(sut.getStatus(true, 8 * 60 - 1 + 1000, [1,2,3,4,1000])).toBe(
                Status.MAYBE_ALIVE
            );
        });
        test("Killed 8 or more minutes ago", () => {
            expect(sut.getStatus(true, 8 * 60 + 1000, [1,2,3,4,1000])).toBe(Status.ALIVE);
        });
    });
});
