import dotenv = require("dotenv");
dotenv.config();

// Enabled GSI
import "./gsi/GsiEvents";
import "./gsi/GsiGameState";
import "./gsi/GsiItems";
import "./gsi/GsiTime";

// Enabled assistants
import "./assistants/roshan/Roshan";
//import "./assistants/runes/Runes";
// import "./assistants/stack/Stack";
//import "./assistants/trusty-shovel/TrustyShovel";

// Enabled effects
//import "./effects/playTTS";
//import "./effects/playAudio";

import { engine, Fact } from "./Engine";
import gsi = require("node-gsi");
import log from "./log";
import topic from "./topics";

const debug = false;
const server = new gsi.Dota2GSIServer("/gsi", debug);

server.events.on(gsi.Dota2Event.Dota2State, (gsiData: gsi.IDota2StateEvent) =>
    engine.set(
        new Fact(topic.gsiData, {
            items: gsiData.state.items,
            time: gsiData.state.map?.clockTime,
            events: gsiData.state.events,
            gameState: gsiData.state.map?.gameState,
        })
    )
);

server.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (gsiData: gsi.IDota2ObserverStateEvent) =>
        engine.set(
            new Fact(topic.gsiData, {
                items: gsiData.state.items?.at(0),
                time: gsiData.state.map?.clockTime,
                events: gsiData.state.events,
                gameState: gsiData.state.map?.gameState,
            })
        )
);

log.info("gsi", "Starting GSI server on port 9001");
server.listen(9001);
