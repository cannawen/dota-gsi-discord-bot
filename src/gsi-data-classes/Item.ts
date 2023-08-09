import { DeepReadonly } from "ts-essentials";
import fs from "fs";
import gsi from "node-gsi";
import path from "path";

const items = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../resources/items.json"), "utf8")
);
const itemNames = new Map<string, string>(Object.entries(items));

export default class Item {
    public readonly id: string;
    public readonly name: string;

    public readonly canCast: boolean | undefined;
    public readonly cooldown: number | undefined;
    public readonly charges: number | undefined;

    public constructor(
        id: string,
        name?: string | undefined,
        cooldown?: number | undefined,
        charges?: number | undefined,
        canCast?: boolean | undefined
    ) {
        this.id = id;
        this.name = name || id;
        this.cooldown = cooldown;
        this.charges = charges;
        this.canCast = canCast;
    }

    static create(item: DeepReadonly<gsi.IItem> | null) {
        if (item) {
            return new Item(
                item.name,
                itemNames.get(item.name),
                item.cooldown,
                item.charges,
                item.canCast
            );
        }
        return null;
    }
}
