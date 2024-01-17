import gsi = require("node-gsi");

/**
 * Convert gsi.Dota2State and gsi.Dota2StateObserver
 * to a shared data structure so we can handle them similarily
 */
class GsiData {
    buildings?: gsi.IBuildings;
    events?: gsi.IEvent[];
    hero?: gsi.IHero;
    items?: gsi.IItemContainer;
    map?: gsi.IMap;
    minimap?: gsi.IMinimapElement[] | null;
    player?: gsi.IPlayer;
    abilities?: gsi.IAbility[];
    provider?: gsi.IProvider;

    constructor(options: {
        buildings?: gsi.IBuildings | null;
        events?: gsi.IEvent[] | null;
        hero?: gsi.IHero | null;
        items?: gsi.IItemContainer | null;
        map?: gsi.IMap | null;
        minimap?: gsi.IMinimapElement[] | null;
        player?: gsi.IPlayer | null;
        abilities?: gsi.IAbility[] | null;
        provider?: gsi.IProvider | null;
    }) {
        this.buildings = options.buildings ? options.buildings : undefined;
        this.events = options.events ? options.events : undefined;
        this.hero = options.hero ? options.hero : undefined;
        this.items = options.items ? options.items : undefined;
        this.map = options.map ? options.map : undefined;
        this.minimap = options.minimap ? options.minimap : undefined;
        this.player = options.player ? options.player : undefined;
        this.abilities = options.abilities ? options.abilities : undefined;
        this.provider = options.provider ? options.provider : undefined;
    }
}

export default GsiData;
