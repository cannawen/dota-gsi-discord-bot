// I want to refer outside to all things that handle things
// should I make it a base class even if the implementations don't overlap?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventHandler {

}

interface IEventHandlerGameState extends IEventHandler {
    inGame: (inGame: boolean) => { type: string, data: any };
}

interface IEventHandlerTime extends IEventHandler {
    handleTime: (time: number) => { type: string, data: any };
}

interface IEventHandlerEvents extends IEventHandler {
    handleEvent: (eventType: string, time: number) => { type: string, data: any };
}

export {
    IEventHandler,
    IEventHandlerGameState,
    IEventHandlerTime,
    IEventHandlerEvents,
};
