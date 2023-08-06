import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";

function hasCastableItem(items: PlayerItems, itemId: string): boolean {
    return (
        items
            .allItems()
            .filter((item): item is Item => item !== null)
            .find((item) => item!.id === itemId)?.cooldown === 0
    );
}

export default {
    hasCastableItem,
};
