import {
    Item, PlayerItems,
} from "../../gsi/GsiItems";
import TrustyShovelPlugin from "./TrustyShovelPlugin";

describe("Trusty shovel plugin", () => {
    let sut: TrustyShovelPlugin;
    beforeEach(() => {
        sut = new TrustyShovelPlugin();
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
                const shovel = new Item("item_trusty_shovel", "Trusty Shovel", 10);
                sut.items(new PlayerItems([], [], shovel, null));

                expect(sut.handleTime(0)).toBeUndefined();
                expect(sut.handleTime(15)).toBeUndefined();
                expect(sut.handleTime(30)).toBeUndefined();
            });
        });
        describe("it has been on cooldown for 15 seconds", () => {
            test("there should be a TTS reminder to dig", () => {
                sut.handleTime(0);
                const shovel = new Item("item_trusty_shovel", "Trusty Shovel", 0);
                sut.items(new PlayerItems([], [], shovel, null));

                expect(sut.handleTime(15)).toBeTTS("dig");
            });

            describe("user does not use the shovel", () => {
                test("TTS should be played again after another 15 seconds", () => {
                    sut.handleTime(0);
                    const shovel = new Item("item_trusty_shovel", "Trusty Shovel", 0);
                    sut.items(new PlayerItems([], [], shovel, null));
                    sut.handleTime(15);
                    expect(sut.handleTime(29)).toBeUndefined();
                    expect(sut.handleTime(30)).toBeTTS("dig");
                    expect(sut.handleTime(31)).toBeUndefined();
                });
            });
        });
    });
});
