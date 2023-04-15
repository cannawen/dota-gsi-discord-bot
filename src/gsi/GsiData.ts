import gsi = require("node-gsi");

/**
 * Convert gsi.Dota2State and gsi.Dota2StateObserver
 * to a shared data structure so we can handle them similarily
 */
class GsiData {
    events?: gsi.IEvent[];
    hero?: gsi.IHero;
    items?: gsi.IItemContainer;
    map?: gsi.IMap;
    player?: gsi.IPlayer;
    provider?: gsi.IProvider;

    constructor(options: {
        events?: gsi.IEvent[] | null;
        hero?: gsi.IHero | null;
        items?: gsi.IItemContainer | null;
        map?: gsi.IMap | null;
        player?: gsi.IPlayer | null;
        provider?: gsi.IProvider | null;
    }) {
        this.events = options.events ? options.events : undefined;
        this.hero = options.hero ? options.hero : undefined;
        this.items = options.items ? options.items : undefined;
        this.map = options.map ? options.map : undefined;
        this.player = options.player ? options.player : undefined;
        this.provider = options.provider ? options.provider : undefined;
    }
}

export default GsiData;
