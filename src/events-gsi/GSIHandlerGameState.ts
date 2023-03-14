import handler from "../events-app/eventHandlers";

const events = [
    handler.roshan,
];

export default class GSIHandlerGameState {
    inGame = false;

    isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;
            console.log("In game?" + newInGame);
            events.map((event) => event.inGame(newInGame));
        }
    }
}
