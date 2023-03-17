import {
    isGsiEventObserver,
    isGsiGameStateObserver,
    isGsiItemsObserver,
    isGsiTimeObserver,
} from "./IGsiObservers";

import GsiEventsSubject from "./gsi/GsiEventsSubject";
import GsiGameStateSubject from "./gsi/GsiGameStateSubject";
import GsiItemsSubject from "./gsi/GsiItemsSubject";
import GsiTimeSubject from "./gsi/GsiTimeSubject";

export default [
    {
        subject:     new GsiEventsSubject(),
        typeChecker: isGsiEventObserver,
    },
    {
        subject:     new GsiGameStateSubject(),
        typeChecker: isGsiGameStateObserver,
    },
    {
        subject:     new GsiTimeSubject(),
        typeChecker: isGsiTimeObserver,
    },
    {
        subject:     new GsiItemsSubject(),
        typeChecker: isGsiItemsObserver,
    },
];
