import dotenv = require("dotenv");
dotenv.config();

// Enabled GSI
import "./gsi/gsiEvents";
import "./gsi/gsiGameState";
import "./gsi/gsiHero";
import "./gsi/gsiItems";
import "./gsi/gsiTime";

// Enabled assistants
import "./assistants/roshan";
import "./assistants/runes";
import "./assistants/neutralItem";

// Enabled effects
import "./effects/playAudio";
import "./effects/playTts";

import engine from "./customEngine";
import gsi = require("node-gsi");
import log from "./log";

const debug = process.env.GSI_DEBUG === "true";
const server = new gsi.Dota2GSIServer("/gsi", debug);

// TODO refactor time and gamestate to be under map and split up later
server.events.on(gsi.Dota2Event.Dota2State, (gsiData: gsi.IDota2StateEvent) =>
    engine.setGsi({
        events: gsiData.state.events,
        gameState: gsiData.state.map?.gameState,
        hero: gsiData.state.hero,
        items: gsiData.state.items,
        time: gsiData.state.map?.clockTime,
    })
);

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
const playerId = 6;
server.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (gsiData: gsi.IDota2ObserverStateEvent) =>
        engine.setGsi({
            events: gsiData.state.events,
            gameState: gsiData.state.map?.gameState,
            hero: gsiData.state.hero?.at(playerId),
            items: gsiData.state.items?.at(playerId),
            time: gsiData.state.map?.clockTime,
        })
);

log.info("gsi", "Starting GSI server on port 9001");
// eslint-disable-next-line no-magic-numbers
server.listen(9001);
