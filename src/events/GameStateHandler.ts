import handler from "./EventHandler";

const events = [
    handler.roshan,
];

export default class GameStateHandler {
    isInGame(inGame: boolean) {
        events.map((event) => event.inGame(inGame));
    }
}
