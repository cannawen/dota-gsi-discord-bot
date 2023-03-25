import fs from "fs";
import gsi from "node-gsi";
import path from "path";

const items = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../../data/items.json"), "utf8")
);
const itemNames = new Map<string, string>(Object.entries(items));

export default class Item {
    id: string;
    name: string;
    cooldown?: number;

    public constructor(id: string, name: string, cooldown?: number) {
        this.id = id;
        this.name = name;
        this.cooldown = cooldown;
    }

    static create(item: gsi.IItem | null) {
        if (item) {
            const name = itemNames.get(item.name);
            return new Item(item.name, name ? name : item.name, item.cooldown);
        }
        return null;
    }
}
