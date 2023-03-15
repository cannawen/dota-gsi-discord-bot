import {
    isGsiEventSubscriber,
    isGsiGameStateSubscriber,
    isGsiTimeSubscriber,
} from "./events-app/IGsiSubscribers";

import AppHandler from "./events-app/AppHandler";
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

const appHandlers : AppHandler[] = [
    new AppRoshanHandler(),
    new AppRunesHandler(),
    new AppStackHandler(),
];

appHandlers
    .filter(isGsiEventSubscriber)
    .map((subscriber) => event.addSubscriber(subscriber));

appHandlers
    .filter(isGsiGameStateSubscriber)
    .map((subscriber) => gameState.addSubscriber(subscriber));

appHandlers
    .filter(isGsiTimeSubscriber)
    .map((subscriber) => time.addSubscriber(subscriber));

export default {
    event,
    gameState,
    time,
};
