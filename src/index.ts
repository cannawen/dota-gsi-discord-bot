import GSI = require("node-gsi");
import log = require("npmlog");
import timeHandler from "./events/TimeHandler";

const debug = true;
const server = new GSI.Dota2GSIServer("/gsi", debug);

server.events.on(GSI.Dota2Event.Dota2State, (event: GSI.IDota2StateEvent) => {
    log.verbose("GSI", "New event");
    if (event.state.map?.clockTime) {
        timeHandler(event.state.map.clockTime);
    }
});

server.events.on(GSI.Dota2Event.Dota2ObserverState, (event: GSI.IDota2ObserverStateEvent) => {
    log.verbose("GSI", "New observer event!");
    if (event.state.map?.clockTime) {
        timeHandler(event.state.map.clockTime);
    }
});

server.listen(9001);
