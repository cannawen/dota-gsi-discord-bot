import {
    isGsiEventObserver,
    isGsiGameStateObserver,
    isGsiTimeObserver,
} from "./events-app/IGsiObservers";

import AppLogic from "./events-app/AppLogic";
import AppRoshanLogic from "./events-app/roshan/AppRoshanLogic";
import AppRunesLogic from "./events-app/runes/AppRunesLogic";
import AppStackLogic from "./events-app/stack/AppStackLogic";

import GsiEventsSubject from "./events-gsi/GsiEventsSubject";
import GsiGameStateSubject from "./events-gsi/GsiGameStateSubject";
import GsiTimeSubject from "./events-gsi/GsiTimeSubject";

const event = new GsiEventsSubject();
const gameState = new GsiGameStateSubject();
const time = new GsiTimeSubject();

gameState.addObserver(event);

const appHandlers : AppLogic[] = [
    new AppRoshanLogic(),
    new AppRunesLogic(),
    new AppStackLogic(),
];

appHandlers
    .filter(isGsiEventObserver)
    .map((subscriber) => event.addObserver(subscriber));

appHandlers
    .filter(isGsiGameStateObserver)
    .map((subscriber) => gameState.addObserver(subscriber));

appHandlers
    .filter(isGsiTimeObserver)
    .map((subscriber) => time.addObserver(subscriber));

export default {
    event,
    gameState,
    time,
};
