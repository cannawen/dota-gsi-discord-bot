import {
    isGsiEventObserver,
    isGsiGameStateObserver,
    isGsiTimeObserver,
} from "./events-app/IGsiObservers";

import GsiEventsSubject from "./events-gsi/GsiEventsSubject";
import GsiGameStateSubject from "./events-gsi/GsiGameStateSubject";
import GsiTimeSubject from "./events-gsi/GsiTimeSubject";

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
];
