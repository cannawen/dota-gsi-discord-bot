import AppRoshanHandler from "./roshan/AppRoshanHandler";
import AppRunesHandler from "./runes/AppRunesHandler";
import AppStackHandler from "./stack/AppStackHandler";

const roshan = new AppRoshanHandler();
const runes = new AppRunesHandler();
const stack = new AppStackHandler();

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
