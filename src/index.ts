// Enabled GSI
import "./gsi/GsiEvents";
import "./gsi/GsiGameState";
import "./gsi/GsiItems";
import "./gsi/GsiTime";

// Enabled assistants
import "./assistants/roshan/Roshan";
import "./assistants/runes/Runes";
// import "./assistants/stack/Stack";
import "./assistants/trusty-shovel/TrustyShovel";

// Enabled effects
import "./effects/playTTS";
import "./effects/playAudio";

import gsi = require("node-gsi");
import broker from "./broker";
import log from "./log";
import Topic from "./Topic";

const debug = false;
const server = new gsi.Dota2GSIServer("/gsi", debug);

function handle(state: gsi.IDota2State | gsi.IDota2ObserverState) {
    broker.publish(Topic.GSI_DATA, state);
}

server.events.on(gsi.Dota2Event.Dota2State, (event: gsi.IDota2StateEvent) => {
    handle(event.state);
});

server.events.on(gsi.Dota2Event.Dota2ObserverState, (event: gsi.IDota2ObserverStateEvent) => {
    handle(event.state);
});

log.gsi.info("Starting GSI server on port 9001");
server.listen(9001);
