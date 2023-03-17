import "./plugins/enabledPlugins";
import "./effects/enabledEffects";
import gsi = require("node-gsi");
import log from "./log";
import subjects from "./subjects";

const debug = false;
const server = new gsi.Dota2GSIServer("/gsi", debug);

function handle(state: gsi.IDota2State | gsi.IDota2ObserverState) {
    subjects.map(({
        subject,
    }) => subject.handleState(state));
}

server.events.on(gsi.Dota2Event.Dota2State, (event: gsi.IDota2StateEvent) => {
    handle(event.state);
});

server.events.on(gsi.Dota2Event.Dota2ObserverState, (event: gsi.IDota2ObserverStateEvent) => {
    handle(event.state);
});

log.gsi.info("Starting GSI server on port 9001");
server.listen(9001);
