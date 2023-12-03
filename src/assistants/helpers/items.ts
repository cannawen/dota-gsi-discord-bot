import PlayerItems from "../../gsi-data-classes/PlayerItems";

function hasOpenSlot(items: PlayerItems): boolean {
    const inventorySlots = items.inventory.filter(
        (item) => item === null
    ).length;
    return inventorySlots > 0;
}

export default {
    hasOpenSlot,
};
