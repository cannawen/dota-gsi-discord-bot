import {
    IDota2ObserverState, IDota2State, IItem, IItemContainer,
} from "node-gsi";
import broker from "../broker";
import log from "../log";
import Topic from "../Topic";

class Item {
    id: string;
    name: string;
    cooldown?: number;

    public constructor(id: string, name: string, cooldown?: number) {
        this.id = id;
        this.name = name;
        this.cooldown = cooldown;
    }

    static createFromGsi(item: IItem | null) {
        // TODO find real human readable name from of the item and pass it along in second parameter
        if (item) {
            return new Item(item.name, item.name, item.cooldown);
        }
        return null;
    }
}

class PlayerItems {
    inventory: Array<Item | null> = [];
    stash: Array<Item | null> = [];
    neutral: Item | null = null;
    teleport: Item | null = null;

    constructor(inventory: Array<Item | null>, stash:Array<Item | null>, neutral: Item | null, teleport: Item | null) {
        this.inventory = inventory;
        this.stash = stash;
        this.neutral = neutral;
        this.teleport = teleport;
    }

    static createFromGsi(items: IItemContainer) {
        return new PlayerItems(
            items.slot.map(Item.createFromGsi),
            items.stash.map(Item.createFromGsi),
            Item.createFromGsi(items.neutral),
            Item.createFromGsi(items.teleport)
        );
    }
}

export {
    Item,
    PlayerItems,
};

class GsiItems {
    private handleItems(itemContainer: IItemContainer) {
        log.gsiItems.debug(itemContainer);
        const items = PlayerItems.createFromGsi(itemContainer);
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
broker.register(Topic.GSI_DATA, Topic.DOTA_2_ITEMS, component.handleState.bind(component));
