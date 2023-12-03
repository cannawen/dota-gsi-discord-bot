import fs from "fs";
import path from "path";
import PlayerItems from "../../gsi-data-classes/PlayerItems";

function hasOpenSlot(items: PlayerItems): boolean {
    const inventorySlots = items.inventory.filter(
        (item) => item === null
    ).length;
    return inventorySlots > 0;
}

// [["Observer Ward", 0], ["Sentry Ward", 50], ...]
const itemCosts: Array<[string, number]> = Object.entries(
    JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../resources/itemCosts.json"),
            "utf8"
        )
    )
);

export default {
    hasOpenSlot,
    itemCosts,
};
