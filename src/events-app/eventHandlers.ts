import AppHandlerRoshan from "./roshan/AppHandlerRoshan";
import AppHandlerRunes from "./runes/AppHandlerRunes";
import AppHandlerStack from "./stack/AppHandlerStack";

const roshan = new AppHandlerRoshan();
const runes = new AppHandlerRunes();
const stack = new AppHandlerStack();

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
