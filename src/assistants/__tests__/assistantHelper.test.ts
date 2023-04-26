import { NeutralItemHelper, Tier } from "../assistantHelpers";

describe("assistantHelper", () => {
    let sut: NeutralItemHelper;
    beforeEach(() => {
        sut = new NeutralItemHelper();
    });
    describe("timeToTier", () => {
        describe("unknown tier", () => {
            test("between minute 0-7", () => {
                expect(sut.timeToTier(0)).toBe(Tier.UNKNOWN);
                expect(sut.timeToTier(7 * 60 - 1)).toBe(Tier.UNKNOWN);
            });
        });
        describe("tier one", () => {
            test("between minute 7-17", () => {
                expect(sut.timeToTier(7 * 60)).toBe(Tier.ONE);
                expect(sut.timeToTier(17 * 60 - 1)).toBe(Tier.ONE);
            });
        });
        describe("tier two", () => {
            test("between minute 17-27", () => {
                expect(sut.timeToTier(17 * 60)).toBe(Tier.TWO);
                expect(sut.timeToTier(27 * 60 - 1)).toBe(Tier.TWO);
            });
        });
        describe("tier three", () => {
            test("between minute 27-37", () => {
                expect(sut.timeToTier(27 * 60)).toBe(Tier.THREE);
                expect(sut.timeToTier(37 * 60 - 1)).toBe(Tier.THREE);
            });
        });
        describe("tier four", () => {
            test("between minute 37-60", () => {
                expect(sut.timeToTier(37 * 60)).toBe(Tier.FOUR);
                expect(sut.timeToTier(60 * 60 - 1)).toBe(Tier.FOUR);
            });
        });

        describe("tier five", () => {
            test("after minute 60", () => {
                expect(sut.timeToTier(60 * 60)).toBe(Tier.FIVE);
                expect(sut.timeToTier(2 * 60 * 60)).toBe(Tier.FIVE);
            });
        });
    });

    describe("nameToTier", () => {
        test("Unknown neutral item", () => {
            expect(sut.nameToTier("item_flask")).toBe(Tier.UNKNOWN);
        });
        test("Trusty Shovel", () => {
            expect(sut.nameToTier("item_trusty_shovel")).toBe(Tier.ONE);
        });
        test("Philosopher's Stone", () => {
            expect(sut.nameToTier("item_philosophers_stone")).toBe(Tier.TWO);
        });
        test("Pirate Hat", () => {
            expect(sut.nameToTier("item_pirate_hat")).toBe(Tier.FIVE);
        });
    });
});
