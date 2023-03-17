import {
    PlayerItems,
} from "../../gsi/GsiItemsSubject";
import SideEffectInfo from "../../SideEffectInfo";
import TrustyShovelPlugin from "./TrustyShovelPlugin";

describe("Trusty shovel plugin", () => {
    let sut: TrustyShovelPlugin;
    beforeEach(() => {
        sut = new TrustyShovelPlugin();
    });

    describe("when player does not have trusty shovel item", () => {
        test("it should not return a side effect", () => {
            const timeEffect = sut.handleTime(0);
            const itemEffect = sut.items(new PlayerItems([], [], null, null));

            expect(timeEffect).toBeUndefined();
            expect(itemEffect).toBeUndefined();
        });
    });
});
