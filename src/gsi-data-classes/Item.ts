import { DeepReadonly } from "ts-essentials";
import gsi from "node-gsi";
import helper from "../assistants/helpers/items";

export default class Item {
    public readonly id: string;
    public readonly name: string;

    public readonly cooldown: number | undefined;
    public readonly charges: number | undefined;
    public readonly canCast: boolean | undefined;
    public readonly cost: number | undefined;

    public constructor(
        id: string,
        name?: string | undefined,
        cooldown?: number | undefined,
        charges?: number | undefined,
        canCast?: boolean | undefined,
        cost?: number | undefined
    ) {
        this.id = id;
        this.name = name || id;
        this.cooldown = cooldown;
        this.charges = charges;
        this.canCast = canCast;
        this.cost = cost;
    }

    static create(item: DeepReadonly<gsi.IItem> | null) {
        if (item) {
            const name = helper.itemIdsToNames.get(item.name) || item.name;
            const cost = helper.itemNamesToCosts.get(name);

            return new Item(
                item.name,
                name,
                item.cooldown,
                item.charges,
                item.canCast,
                cost
            );
        }
        return null;
    }
}
