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

// Discord
import "./discord/client";
import "./discord/startVoiceSubscription";
import "./discord/playAudioQueue";

import engine from "./customEngine";
import gsi = require("node-gsi");
import log from "./log";

const debug = process.env.GSI_DEBUG === "true";
const server = new gsi.Dota2GSIServer("/gsi", debug);

// TODO refactor time and gamestate to be under map and split up later
server.events.on(gsi.Dota2Event.Dota2State, (data: gsi.IDota2StateEvent) => {
    // Check to see if we care about this auth token before sending info to the engine
    // See if it matches topic.discordCoachMe and is not undefined
    engine.setGsi(data.auth, {
        events: data.state.events,
        gameState: data.state.map?.gameState,
        hero: data.state.hero,
        items: data.state.items,
        time: data.state.map?.clockTime,
    });
});

// If we are looking at a replay or as an observer,
// run all logic on the items of one of the players only (from 0-9)
// needs to be 6 for mitmproxy die-respawn-dig-dig_canna to run properly
const playerId = 6;
server.events.on(
    gsi.Dota2Event.Dota2ObserverState,
    (data: gsi.IDota2ObserverStateEvent) => {
        engine.setGsi(data.auth, {
            events: data.state.events,
            gameState: data.state.map?.gameState,
            hero: data.state.hero?.at(playerId),
            items: data.state.items?.at(playerId),
            time: data.state.map?.clockTime,
        });
    }
);

log.info("gsi", "Starting GSI server on port 9001");
// eslint-disable-next-line no-magic-numbers
server.listen(9001);
