import EventHandlerRoshan from "./roshan/EventHandlerRoshan";
import EventHandlerRunes from "./runes/EventHandlerRunes";
import EventHandlerStack from "./stack/EventHandlerStack";

const roshan = new EventHandlerRoshan();
const runes = new EventHandlerRunes();
const stack = new EventHandlerStack();

export default {
    roshan,
    runes,
    stack,
};

// This is what I want
// const eventHandlers: IEventHandler[] = [ roshan, runes, stack ];
// eventHandlers.map((e) => {
//     if (e instanceof IEventHandlerTime) {
//         TimeHandler.subscribe(e);
//     }
//     if (e instanceof IEventHandlerStateful) {
//         GameStateHandler.subscribe(e);
//     }
//     if (e instanceof IEventHandlerEvents) {
//         EventsHandler.subscribe(e);
//     }
// });
