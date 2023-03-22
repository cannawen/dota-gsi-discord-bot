import gsi = require("node-gsi");

type GsiData = {
    items: gsi.IItemContainer | undefined | null;
    time: number | undefined;
    events: gsi.IEvent[] | null;
    gameState: gsi.Dota2GameState | undefined;
};

export default GsiData;
