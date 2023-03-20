import gsi from "node-gsi";

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
        // TODO find real human readable name from of the item and pass it along in second parameter
        if (item) {
            return new Item(item.name, item.name, item.cooldown);
        }
        return null;
    }
}
