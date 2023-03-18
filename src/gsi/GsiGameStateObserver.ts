import EffectInfo from "./EffectInfo";

// Refactor to "inAGame" and "notInGame"
interface GsiGameStateObserver {
    inGame: (inGame: boolean) => EffectInfo | void;
}

export function isGsiGameStateObserver(observer: any): observer is GsiGameStateObserver {
    return typeof observer.inGame === "function";
}

export default GsiGameStateObserver;
