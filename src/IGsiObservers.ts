// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGsiItemsObserver {
    items: () => void
}

function isGsiItemsObserver(observer: any): observer is IGsiItemsObserver {
    return typeof observer.items === "function";
}

// Refactor to "inAGame" and "notInGame"
interface IGsiGameStateObserver {
    inGame: (inGame: boolean) => { type: string, data: any };
}

function isGsiGameStateObserver(observer: any): observer is IGsiGameStateObserver {
    return typeof observer.inGame === "function";
}

interface IGsiTimeObserver {
    handleTime: (time: number) => { type: string, data: any };
}

function isGsiTimeObserver(observer: any): observer is IGsiTimeObserver {
    return typeof observer.handleTime === "function";
}

interface IGsiEventsObserver {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
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
