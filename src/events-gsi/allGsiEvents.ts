import GsiEventsHandler from "./GsiEventsHandler";
import GsiGameStateHandler from "./GsiGameStateHandler";
import GsiTimeHandler from "./GsiTimeHandler";

const event = new GsiEventsHandler();
const gameState = new GsiGameStateHandler();
const time = new GsiTimeHandler();

export default {
    event,
    gameState,
    time,
};
