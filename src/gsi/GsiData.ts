import gsi = require("node-gsi");

/**
 * Convert gsi.Dota2State and gsi.Dota2StateObserver
 * to a shared data structure so we can handle them similarily
 */
type GsiData = {
    items: gsi.IItemContainer | undefined | null;
    time: number | undefined;
    events: gsi.IEvent[] | null;
    gameState: gsi.Dota2GameState | undefined;
};

export default GsiData;
