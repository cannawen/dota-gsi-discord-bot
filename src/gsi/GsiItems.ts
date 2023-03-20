import {
    IDota2ObserverState, IDota2State, IItemContainer,
} from "node-gsi";
import broker from "../broker";
import log from "../log";
import PlayerItems from "../PlayerItems";
import Topic from "../Topic";

class GsiItems {
    private handleItems(itemContainer: IItemContainer) {
        log.debug("gsi", "%s", itemContainer);
        const items = PlayerItems.create(itemContainer);
        if (items) {
            return items;
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): PlayerItems | void {
        if (Array.isArray(state.items)) { // If we are in observer mode
            return this.handleItems(state.items[0]); // Pick the first person
        } else if (state.items) {
            return this.handleItems(state.items);
        }
    }
}

const component = new GsiItems();
broker.register("GSI/ITEMS", Topic.GSI_DATA_LIVE, Topic.DOTA_2_ITEMS, component.handleState.bind(component));
broker.register("GSI/ITEMS", Topic.GSI_DATA_OBSERVER, Topic.DOTA_2_ITEMS, component.handleState.bind(component));
