import GsiEvents from "./gsi/GsiEvents";
import GsiGameState from "./gsi/GsiGameState";
import GsiItems from "./gsi/GsiItems";
import GsiTime from "./gsi/GsiTime";
import {
    isGsiEventObserver,
} from "./gsi/GsiEventsObserver";
import {
    isGsiGameStateObserver,
} from "./gsi/GsiGameStateObserver";
import {
    isGsiItemsObserver,
} from "./gsi/GsiItemsObserver";
import {
    isGsiTimeObserver,
} from "./gsi/GsiTimeObserver";

export default [
    {
        subject:     new GsiEvents(),
        typeChecker: isGsiEventObserver,
    },
    {
        subject:     new GsiGameState(),
        typeChecker: isGsiGameStateObserver,
    },
    {
        subject:     new GsiTime(),
        typeChecker: isGsiTimeObserver,
    },
    {
        subject:     new GsiItems(),
        typeChecker: isGsiItemsObserver,
    },
];
