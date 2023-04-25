import { NeutralItemHelper, Tier } from "../assistantHelpers";

class TestNeutralItemHelper extends NeutralItemHelper {
    public timeToTierPublic(time: number): Tier {
        return this.timeToTier(time);
    }
    public nameToTierPublic(itemName: string): Tier {
        return this.nameToTier(itemName);
    }
}

describe("assistantHelper", () => {
    let sut: TestNeutralItemHelper;
    beforeEach(() => {
        sut = new TestNeutralItemHelper();
    });
    describe("timeToTier", () => {
        describe("unknown tier", () => {
            test("between minute 0-7", () => {
                expect(sut.timeToTierPublic(0)).toBe(Tier.UNKNOWN);
                expect(sut.timeToTierPublic(7 * 60 - 1)).toBe(Tier.UNKNOWN);
            });
        });
        describe("tier one", () => {
            test("between minute 7-17", () => {
                expect(sut.timeToTierPublic(7 * 60)).toBe(Tier.ONE);
                expect(sut.timeToTierPublic(17 * 60 - 1)).toBe(Tier.ONE);
            });
        });
        describe("tier two", () => {
            test("between minute 17-27", () => {
                expect(sut.timeToTierPublic(17 * 60)).toBe(Tier.TWO);
                expect(sut.timeToTierPublic(27 * 60 - 1)).toBe(Tier.TWO);
            });
        });
        describe("tier three", () => {
            test("between minute 27-37", () => {
                expect(sut.timeToTierPublic(27 * 60)).toBe(Tier.THREE);
                expect(sut.timeToTierPublic(37 * 60 - 1)).toBe(Tier.THREE);
            });
        });
        describe("tier four", () => {
            test("between minute 37-60", () => {
                expect(sut.timeToTierPublic(37 * 60)).toBe(Tier.FOUR);
                expect(sut.timeToTierPublic(60 * 60 - 1)).toBe(Tier.FOUR);
            });
        });

        describe("tier five", () => {
            test("after minute 60", () => {
                expect(sut.timeToTierPublic(60 * 60)).toBe(Tier.FIVE);
                expect(sut.timeToTierPublic(2 * 60 * 60)).toBe(Tier.FIVE);
            });
        });
    });

    describe("nameToTier", () => {
        test("Unknown neutral item", () => {
            expect(sut.nameToTierPublic("Healing Salve")).toBe(Tier.UNKNOWN);
        });
        test("Trusty Shovel", () => {
            expect(sut.nameToTierPublic("Trusty Shovel")).toBe(Tier.ONE);
        });
        test("Philosopher's Stone", () => {
            expect(sut.nameToTierPublic("Philosopher's Stone")).toBe(Tier.TWO);
        });
        test("Pirate Hat", () => {
            expect(sut.nameToTierPublic("Pirate Hat")).toBe(Tier.FIVE);
        });
    });
});
