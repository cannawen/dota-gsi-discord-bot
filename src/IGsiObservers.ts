// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGsiBaseObserver {

}

interface IGsiItemsObserver {
    items: () => void
}

function isGsiItemsObserver(observer: any): observer is IGsiItemsObserver {
    return typeof observer.items === "function";
}

// Refactor to "inAGame" and "notInGame"
interface IGsiGameStateObserver extends IGsiBaseObserver {
    inGame: (inGame: boolean) => { type: string, data: any };
}

function isGsiGameStateObserver(observer: any): observer is IGsiGameStateObserver {
    return typeof observer.inGame === "function";
}

interface IGsiTimeObserver extends IGsiBaseObserver {
    handleTime: (time: number) => { type: string, data: any };
}

function isGsiTimeObserver(observer: any): observer is IGsiTimeObserver {
    return typeof observer.handleTime === "function";
}

interface IGsiEventsObserver extends IGsiBaseObserver {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
}

function isGsiEventObserver(observer: any): observer is IGsiEventsObserver {
    return typeof observer.handleEvent === "function";
}

export {
    IGsiBaseObserver,
    IGsiGameStateObserver,
    IGsiItemsObserver,
    IGsiTimeObserver,
    IGsiEventsObserver,
    isGsiGameStateObserver,
    isGsiItemsObserver,
    isGsiTimeObserver,
    isGsiEventObserver,
};