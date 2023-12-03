import fs from "fs";
import path from "path";
import PlayerItems from "../../gsi-data-classes/PlayerItems";

function hasOpenSlot(items: PlayerItems): boolean {
    return items.inventory.filter((item) => item === null).length > 0;
}

function hasSmallItem(items: PlayerItems): boolean {
    return (
        items.inventory.filter((item) => item?.cost && item.cost < 500).length >
        0
    );
}

// [["Observer Ward", 0], ["Sentry Ward", 50], ...]
const itemCosts: Array<[string, number]> = Object.entries(
    JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../../resources/itemCosts.json"),
            "utf8"
        )
    )
);

const itemIdsToNames = new Map<string, string>(
    Object.entries(
        JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../../../resources/items.json"),
                "utf8"
            )
        )
    )
);

export default {
    hasOpenSlot,
    hasSmallItem,
    itemCosts,
    itemIdsToNames,
};
