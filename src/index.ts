import GSI = require("node-gsi");
import log = require("npmlog");

import GameStateHandler from "./events/GameStateHandler";
import TimeHandler from "./events/TimeHandler";

const debug = false;
const server = new GSI.Dota2GSIServer("/gsi", debug);
const timeHandler = new TimeHandler();
const gameStateHandler = new GameStateHandler();

function handle(state: GSI.IDota2State | GSI.IDota2ObserverState) {
    if (state.map?.clockTime) {
        timeHandler.currentTime(state.map.clockTime);
    }

    if (state.map?.gameState) {
        switch (state.map?.gameState) {
        case GSI.Dota2GameState.PreGame:
        case GSI.Dota2GameState.TeamShowcase:
        case GSI.Dota2GameState.PostGame:
            gameStateHandler.isInGame(false);
            break;
        case GSI.Dota2GameState.GameInProgress:
            gameStateHandler.isInGame(true);
            break;
        default:
            break;
        }
    }
}

server.events.on(GSI.Dota2Event.Dota2State, (event: GSI.IDota2StateEvent) => {
    handle(event.state);
});

server.events.on(GSI.Dota2Event.Dota2ObserverState, (event: GSI.IDota2ObserverStateEvent) => {
    handle(event.state);
});

server.listen(9001);
