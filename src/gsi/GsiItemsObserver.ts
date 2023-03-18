import EffectInfo from "../EffectInfo";
import {
    PlayerItems,
} from "./GsiItems";

interface GsiItemsObserver {
    items: (items: PlayerItems) => EffectInfo | void;
}

export function isGsiItemsObserver(observer: any): observer is GsiItemsObserver {
    return typeof observer.items === "function";
}

export default GsiItemsObserver;
