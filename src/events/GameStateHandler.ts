import handler from "./EventHandler";

const events = [
    handler.roshan,
];

export default function handle(inGame: boolean) {
    events.map((event) => event.inGame(inGame));
}
