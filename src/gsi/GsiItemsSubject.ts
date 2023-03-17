import {
    IDota2ObserverState, IDota2State, IItemContainer,
} from "node-gsi";
import GsiSubject from "./GsiSubject";
import log from "../log";

export default class GsiItemsSubject extends GsiSubject {
    private handleItems(items: IItemContainer) {
        log.gsiItems.debug(items);
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
