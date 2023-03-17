import {
    IDota2ObserverState, IDota2State, IItem, IItemContainer,
} from "node-gsi";
import GsiSubject from "./GsiSubject";
import log from "../log";
import SideEffect from "../SideEffect";
import {
    IGsiItemsObserver,
} from "../IGsiObservers";

class Item {
    id: string;
    name: string;

    constructor(item: IItem) {
        this.id = item.name;
        this.name = item.name;
    }
}

class PlayerItems {
    inventory: Array<Item | null>;
    stash: Array<Item | null>;
    neutral: Item | null;
    teleport: Item | null;

    constructor(items: IItemContainer) {
        this.inventory = items.slot.map((item) => item ? new Item(item) : null);
        this.stash = items.stash.map((item) => item ? new Item(item) : null);
        this.neutral = items.neutral ? new Item(items.neutral) : null;
        this.teleport = items.teleport ? new Item(items.teleport) : null;
    }
}

export {
    Item,
    PlayerItems,
};

export default class GsiItemsSubject extends GsiSubject {
    protected observers: IGsiItemsObserver[] = [];

    private handleItems(itemContainer: IItemContainer) {
        log.gsiItems.debug(itemContainer);
        const items = new PlayerItems(itemContainer);

        this.observers.map((observer) => observer.items(items)) // notify all observers about items
            .map((info) => SideEffect.create(info)) // create a side effect from the side effect info
            .map((sideEffect) => sideEffect.execute()); // execute that side effect - this doesn't belong here
    }

    public handleState(state: IDota2State | IDota2ObserverState): void {
        if (Array.isArray(state.items)) { // If we are in observer mode
            this.handleItems(state.items[0]); // Pick the first person
        } else if (state.items) {
            this.handleItems(state.items);
        }
    }
}

// State
// {"slot":[],"stash":[]}
//
// Observer state
// [
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]},
//     {"slot":[],"stash":[]}
// ]
// For one person
// {
//     slot: [
//       {
//         name: "item_tango",
//         purchaser: 0,
//         passive: false,
//         can_cast: true,
//         cooldown: 0,
//         charges: 2,
//       },
//       null,
//       null,
//       {
//         name: "item_branches",
//         purchaser: 0,
//         passive: false,
//         can_cast: true,
//         cooldown: 0,
//       },
//       {
//         name: "item_magic_stick",
//         purchaser: 0,
//         passive: false,
//         can_cast: false,
//         cooldown: 0,
//         charges: 0,
//       },
//       {
//         name: "item_branches",
//         purchaser: 0,
//         passive: false,
//         can_cast: true,
//         cooldown: 0,
//       },
//       null,
//       null,
//       null,
//     ],
//     stash: [
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//     ],
//   }
