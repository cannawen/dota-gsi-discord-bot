// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGsiBaseSubscriber {

}

// Refactor to "inAGame" and "notInGame"
interface IGsiGameStateSubscriber extends IGsiBaseSubscriber {
    inGame: (inGame: boolean) => { type: string, data: any };
}

interface IGsiTimeSubscriber extends IGsiBaseSubscriber {
    handleTime: (time: number) => { type: string, data: any };
}

interface IGsiEventsSubscriber extends IGsiBaseSubscriber {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
}

export {
    IGsiBaseSubscriber,
    IGsiGameStateSubscriber,
    IGsiTimeSubscriber,
    IGsiEventsSubscriber,
};
