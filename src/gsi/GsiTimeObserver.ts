import EffectInfo from "./EffectInfo";

interface GsiTimeObserver {
    handleTime: (time: number) => EffectInfo | void;
}

export function isGsiTimeObserver(observer: any): observer is GsiTimeObserver {
    return typeof observer.handleTime === "function";
}

export default GsiTimeObserver;
