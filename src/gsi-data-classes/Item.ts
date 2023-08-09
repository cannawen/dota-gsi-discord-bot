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
    public readonly cooldown?: number;
    public readonly charges?: number;

    public constructor(
        id: string,
        name?: string,
        cooldown?: number,
        charges?: number
    ) {
        this.id = id;
        this.name = name || id;
        this.cooldown = cooldown;
        this.charges = charges;
    }

    static create(item: DeepReadonly<gsi.IItem> | null) {
        if (item) {
            return new Item(
                item.name,
                itemNames.get(item.name),
                item.cooldown,
                item.charges
            );
        }
        return null;
    }
}
