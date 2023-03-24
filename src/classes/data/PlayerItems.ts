import gsi from "node-gsi";
import Item from "./Item";

export default class PlayerItems {
    inventory: Array<Item | null> = [];
    stash: Array<Item | null> = [];
    neutral: Item | null = null;
    teleport: Item | null = null;

    constructor(
        inventory: Array<Item | null>,
        stash: Array<Item | null>,
        neutral: Item | null,
        teleport: Item | null
    ) {
        this.inventory = inventory;
        this.stash = stash;
        this.neutral = neutral;
        this.teleport = teleport;
    }

    static create(items: gsi.IItemContainer) {
        return new PlayerItems(
            items.slot.map(Item.create),
            items.stash.map(Item.create),
            Item.create(items.neutral),
            Item.create(items.teleport)
        );
    }
}
