import gsi = require("node-gsi");

/**
 * Convert gsi.Dota2State and gsi.Dota2StateObserver
 * to a shared data structure so we can handle them similarily
 */
type GsiData = {
    events: gsi.IEvent[] | null;
    hero: gsi.IHero | null;
    items: gsi.IItemContainer | null;
    map: gsi.IMap | null;
    player: gsi.IPlayer | null;
};

export default GsiData;
