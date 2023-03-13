import runes from "./runes/index";
import stack from "./stack/index";

const allTimeEvents = [ runes, stack ];
const disabledEvents = [stack];

export default function handle(time: number) {
    allTimeEvents
        .filter((event) => !disabledEvents.includes(event))
        .map((event) => event(time).execute());
}
