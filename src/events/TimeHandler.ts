import runes from "./runes/runes";
import roshan from "./roshan/roshan";

export default function handle(time: number) {
    runes(time).execute();
    roshan(time).execute();
}
