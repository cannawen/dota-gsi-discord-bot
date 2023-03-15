interface IGsiGameStateConsumer {
    inGame: (inGame: boolean) => { type: string, data: any };
}

interface IGsiTimeConsumer {
    handleTime: (time: number) => { type: string, data: any };
}

interface IGsiEventsConsumer {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
}

export {
    IGsiGameStateConsumer,
    IGsiTimeConsumer,
    IGsiEventsConsumer,
};
