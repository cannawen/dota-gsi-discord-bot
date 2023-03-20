import Item from "../../Item";
import PlayerItems from "../../PlayerItems";
import TrustyShovel from "./TrustyShovel";

describe("Trusty shovel", () => {
    let sut: TrustyShovel;
    beforeEach(() => {
        sut = new TrustyShovel();
    });

    describe("when player does not have trusty shovel neutral item", () => {
        test("it should not return a side effect", () => {
            const timeEffect = sut.handleTime(0);
            const itemEffect = sut.items(new PlayerItems([], [], null, null));

            expect(timeEffect).toBeUndefined();
            expect(itemEffect).toBeUndefined();
        });
    });

    describe("when player has a trusty shovel neutral item", () => {
        describe("shovel is on cooldown", () => {
            test("TTS should not be played", () => {
                const shovel = new Item("item_trusty_shovel", "Trusty Shovel", false);
                sut.items(new PlayerItems([], [], shovel, null));

                expect(sut.handleTime(0)).toBeUndefined();
                expect(sut.handleTime(15)).toBeUndefined();
                expect(sut.handleTime(30)).toBeUndefined();
            });
        });
        describe("it has been on cooldown for 15 seconds", () => {
            test("there should be a TTS reminder to dig", () => {
                sut.handleTime(0);
                const shovel = new Item("item_trusty_shovel", "Trusty Shovel", true);
                sut.items(new PlayerItems([], [], shovel, null));

                expect(sut.handleTime(15)).toBe("dig");
            });

            describe("user does not use the shovel", () => {
                test("TTS should be played again after another 15 seconds", () => {
                    sut.handleTime(0);
                    const shovel = new Item("item_trusty_shovel", "Trusty Shovel", true);
                    sut.items(new PlayerItems([], [], shovel, null));
                    sut.handleTime(15);
                    expect(sut.handleTime(29)).toBeUndefined();
                    expect(sut.handleTime(30)).toBe("dig");
                    expect(sut.handleTime(31)).toBeUndefined();
                });
            });
        });
    });
});
