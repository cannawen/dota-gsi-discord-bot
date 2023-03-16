import {
    gsiLog,
    log,
} from "./log";
import gsi = require("node-gsi");
import gsiHandlers from "./app-gsi-integration";

const debug = false;
const server = new gsi.Dota2GSIServer("/gsi", debug);

function handle(state: gsi.IDota2State | gsi.IDota2ObserverState) {
    if (state.map?.clockTime) {
        gsiLog.info("map.clockTime %s", state.map.clockTime);
        gsiHandlers.time.currentTime(state.map.clockTime);
    }

    if (state.events) {
        // change time to game time
        gsiLog.info("events %s", state.events);
        gsiHandlers.event.handle(state.events);
    }

    if (state.map?.gameState) {
        gsiLog.info("map.gameState %s", state.map.gameState);
        switch (state.map?.gameState) {
            case gsi.Dota2GameState.PreGame:
            case gsi.Dota2GameState.TeamShowcase:
            case gsi.Dota2GameState.PostGame:
                gsiHandlers.gameState.isInGame(false);
                break;
            case gsi.Dota2GameState.GameInProgress:
                gsiHandlers.gameState.isInGame(true);
                break;
            default:
                break;
        }
    }
}

server.events.on(gsi.Dota2Event.Dota2State, (event: gsi.IDota2StateEvent) => {
    handle(event.state);
});

server.events.on(gsi.Dota2Event.Dota2ObserverState, (event: gsi.IDota2ObserverStateEvent) => {
    handle(event.state);
});

log.info("Starting server on port 9001");
server.listen(9001);
