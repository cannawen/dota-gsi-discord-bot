import {
    SideEffect,
} from "../SideEffect";

// I want to refer outside to all things that handle things
// should I make it a base class even if the implementations don't overlap?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventHandler {

}

interface IEventHandlerGameState extends IEventHandler {
    inGame: (inGame: boolean) => void;
}

interface IEventHandlerTime extends IEventHandler {
    handleTime: (time: number) => SideEffect;
}

interface IEventHandlerEvents extends IEventHandler {
    handleEvents: (eventType: string, time: number) => SideEffect;
}

export {
    IEventHandler,
    IEventHandlerGameState,
    IEventHandlerTime,
    IEventHandlerEvents,
};
