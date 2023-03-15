import {
    IGsiBaseSubscriber,
    IGsiEventsSubscriber,
    IGsiGameStateSubscriber,
    IGsiTimeSubscriber,
} from "./events-app/IGsiConsumers";

import AppRoshanHandler from "./events-app/roshan/AppRoshanHandler";
import AppRunesHandler from "./events-app/runes/AppRunesHandler";
import AppStackHandler from "./events-app/stack/AppStackHandler";

import GsiEventsHandler from "./events-gsi/GsiEventsHandler";
import GsiGameStateHandler from "./events-gsi/GsiGameStateHandler";
import GsiTimeHandler from "./events-gsi/GsiTimeHandler";

const event = new GsiEventsHandler();
const gameState = new GsiGameStateHandler();
const time = new GsiTimeHandler();

gameState.addSubscriber(event);

const appHandlers : IGsiBaseSubscriber[] = [
    new AppRoshanHandler(),
    new AppRunesHandler(),
    new AppStackHandler(),
];

appHandlers
    .map((handler) => handler as IGsiEventsSubscriber)
    .filter((handler) => Object.keys(handler).length > 0)
    .map((subscriber) => event.addSubscriber(subscriber));

appHandlers
    .map((handler) => (handler as IGsiGameStateSubscriber))
    .filter((handler) => Object.keys(handler).length > 0)
    .map((subscriber) => gameState.addSubscriber(subscriber));

appHandlers
    .map((handler) => (handler as IGsiTimeSubscriber))
    .filter((handler) => Object.keys(handler).length > 0)
    .map((subscriber) => time.addSubscriber(subscriber));

export default {
    event,
    gameState,
    time,
};
