import { IDota2ObserverState, IDota2State, IItemContainer } from "node-gsi";
import broker from "../broker";
import log from "../log";
import PlayerItems from "../PlayerItems";
import Topic from "../Topic";

class GsiItems {
    private handleItems(itemContainer: IItemContainer) {
        log.debug("gsi", "%s", itemContainer);
        return PlayerItems.create(itemContainer);
    }

    public handleState(state: IDota2State): PlayerItems | void {
        if (state.items) {
            return this.handleItems(state.items);
        }
    }

    public handleStateObserver(state: IDota2ObserverState): PlayerItems | void {
        // If we are in observer mode
        // Pick the first person
        if (state.items) {
            return this.handleItems(state.items[0]);
        }
    }
}

const component = new GsiItems();
broker.register(
    "GSI/ITEMS",
    Topic.GSI_DATA_LIVE,
    Topic.DOTA_2_ITEMS,
    component.handleState.bind(component)
);
broker.register(
    "GSI/ITEMS",
    Topic.GSI_DATA_OBSERVER,
    Topic.DOTA_2_ITEMS,
    component.handleStateObserver.bind(component)
);
