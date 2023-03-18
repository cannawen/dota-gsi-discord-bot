import EffectInfo from "../EffectInfo";

interface GsiEventsObserver {
    handleEvent: (eventType: string, time: number) => EffectInfo | void;
}

export function isGsiEventObserver(observer: any): observer is GsiEventsObserver {
    return typeof observer.handleEvent === "function";
}

export default GsiEventsObserver;
