import GSIHandlerEvent from "./GSIHandlerEvent";
import GSIHandlerGameState from "./GSIHandlerGameState";
import GSIHandlerTime from "./GSIHandlerTime";

const event = new GSIHandlerEvent();
const gameState = new GSIHandlerGameState();
const time = new GSIHandlerTime();

export default {
    event,
    gameState,
    time,
};
