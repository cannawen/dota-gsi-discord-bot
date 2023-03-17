import {
    PlayerItems,
} from "./gsi/GsiItemsSubject";
import SideEffectInfo from "./SideEffectInfo";

interface IGsiItemsObserver {
    items: (items: PlayerItems) => SideEffectInfo | void
}

function isGsiItemsObserver(observer: any): observer is IGsiItemsObserver {
    return typeof observer.items === "function";
}

// Refactor to "inAGame" and "notInGame"
interface IGsiGameStateObserver {
    inGame: (inGame: boolean) => SideEffectInfo | void;
}

function isGsiGameStateObserver(observer: any): observer is IGsiGameStateObserver {
    return typeof observer.inGame === "function";
}

interface IGsiTimeObserver {
    handleTime: (time: number) => SideEffectInfo | void;
}

function isGsiTimeObserver(observer: any): observer is IGsiTimeObserver {
    return typeof observer.handleTime === "function";
}

interface IGsiEventsObserver {
    handleEvent: (eventType: string, time: number) => SideEffectInfo | void;
}

function isGsiEventObserver(observer: any): observer is IGsiEventsObserver {
    return typeof observer.handleEvent === "function";
}

export {
    IGsiGameStateObserver,
    IGsiItemsObserver,
    IGsiTimeObserver,
    IGsiEventsObserver,
    isGsiGameStateObserver,
    isGsiItemsObserver,
    isGsiTimeObserver,
    isGsiEventObserver,
};
