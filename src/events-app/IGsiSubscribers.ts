// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGsiBaseSubscriber {

}

// Refactor to "inAGame" and "notInGame"
interface IGsiGameStateSubscriber extends IGsiBaseSubscriber {
    inGame: (inGame: boolean) => { type: string, data: any };
}

function isGsiGameStateSubscriber(subscriber: any): subscriber is IGsiGameStateSubscriber {
    return typeof subscriber.inGame === "function";
}

interface IGsiTimeSubscriber extends IGsiBaseSubscriber {
    handleTime: (time: number) => { type: string, data: any };
}

function isGsiTimeSubscriber(subscriber: any): subscriber is IGsiTimeSubscriber {
    return typeof subscriber.handleTime === "function";
}

interface IGsiEventsSubscriber extends IGsiBaseSubscriber {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
}

function isGsiEventSubscriber(subscriber: any): subscriber is IGsiEventsSubscriber {
    return typeof subscriber.handleEvent === "function";
}

export {
    IGsiBaseSubscriber,
    IGsiGameStateSubscriber,
    IGsiTimeSubscriber,
    IGsiEventsSubscriber,
    isGsiGameStateSubscriber,
    isGsiTimeSubscriber,
    isGsiEventSubscriber,
};
