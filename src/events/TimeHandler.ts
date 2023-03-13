import runes from "./runes/index";
import stack from "./stack/index";

export default function handle(time: number) {
    runes(time).execute();
    stack(time).execute();
}
