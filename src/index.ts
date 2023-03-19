// Enabled GSI
import "./gsi/GsiEvents";
import "./gsi/GsiGameState";
import "./gsi/GsiItems";
import "./gsi/GsiTime";

// Enabled plugins
import "./plugins/roshan/RoshanPlugin";
import "./plugins/runes/RunesPlugin";
// import "./plugins/stack/StackPlugin.ts";
import "./plugins/trusty-shovel/TrustyShovelPlugin";

// Enabled effects
import "./effects/playTTS";
import "./effects/playAudio";

import gsi = require("node-gsi");
import glue from "./glue";
import log from "./log";
import topics from "./topics";

const debug = false;
const server = new gsi.Dota2GSIServer("/gsi", debug);

function handle(state: gsi.IDota2State | gsi.IDota2ObserverState) {
    glue.publish(topics.GSI_DATA, state);
}

server.events.on(gsi.Dota2Event.Dota2State, (event: gsi.IDota2StateEvent) => {
    handle(event.state);
});

server.events.on(gsi.Dota2Event.Dota2ObserverState, (event: gsi.IDota2ObserverStateEvent) => {
    handle(event.state);
});

log.gsi.info("Starting GSI server on port 9001");
server.listen(9001);
