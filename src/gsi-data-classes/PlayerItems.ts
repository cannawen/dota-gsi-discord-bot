import { DeepReadonly } from "ts-essentials";
import gsi from "node-gsi";
import Item from "./Item";

export default class PlayerItems {
    public readonly inventory: Array<Item | null> = [];
    public readonly backpack: Array<Item | null> = [];
    public readonly stash: Array<Item | null> = [];
    public readonly teleport: Item | null = null;
    public readonly neutral: Item | null = null;

    // eslint-disable-next-line max-params
    public constructor(
        inventory: Array<Item | null>,
        backpack: Array<Item | null>,
        stash: Array<Item | null>,
        teleport: Item | null,
        neutral: Item | null
    ) {
        this.inventory = inventory;
        this.backpack = backpack;
        this.stash = stash;
        this.teleport = teleport;
        this.neutral = neutral;
    }

    public allItems(): Array<Item | null> {
        return [
            ...this.inventory,
            ...this.backpack,
            ...this.stash,
            this.teleport,
            this.neutral,
        ];
    }

    public findItem(itemId: string): Item | undefined {
        return this.allItems()
            .filter((item): item is Item => item !== null)
            .find((item) => item!.id === itemId);
    }

    /**
     * Checks if the player has an item or any of its derivative items
     * (i.e. "item_dagon_5" will match "item_dagon")
     */
    public hasItem(itemId: string): boolean {
        return this.allItems().some((item) => item?.id.includes(itemId));
    }

    static create(items: DeepReadonly<gsi.IItemContainer>) {
        const inventoryAndBackpack = items.slot.map(Item.create);
        return new PlayerItems(
            inventoryAndBackpack.slice(0, 6),
            inventoryAndBackpack.slice(6, 9),
            items.stash.map(Item.create),
            Item.create(items.teleport),
            Item.create(items.neutral)
        );
    }
}
