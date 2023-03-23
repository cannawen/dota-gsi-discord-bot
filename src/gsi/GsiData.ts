import gsi = require("node-gsi");

/**
 * Convert gsi.Dota2State and gsi.Dota2StateObserver
 * to a shared data structure so we can handle them similarily
 */
type GsiData = {
    events: gsi.IEvent[] | null;
    gameState: gsi.Dota2GameState | undefined;
    items: gsi.IItemContainer | undefined | null;
    time: number | undefined;
};

export default GsiData;
