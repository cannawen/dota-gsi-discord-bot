import { DeepReadonly } from "ts-essentials";
import gsi from "node-gsi";
import Item from "./Item";

export default class PlayerItems {
    public inventory: Array<Item | null> = [];
    public stash: Array<Item | null> = [];
    public neutral: Item | null = null;
    public teleport: Item | null = null;

    public constructor(
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

    static create(items: DeepReadonly<gsi.IItemContainer>) {
        return new PlayerItems(
            items.slot.map(Item.create),
            items.stash.map(Item.create),
            Item.create(items.neutral),
            Item.create(items.teleport)
        );
    }
}
