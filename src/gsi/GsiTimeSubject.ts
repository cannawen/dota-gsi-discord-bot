import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import GsiSubject from "./GsiSubject";
import {
    IGsiTimeObserver,
} from "../IGsiObservers";
import log from "../log";
import SideEffect from "../SideEffect";

export default class GsiTimeSubject extends GsiSubject {
    protected subscribers : IGsiTimeObserver[] = [];
    private time: number | undefined;

    private currentTime(newTime: number) {
        if (this.time !== newTime) {
            this.time = newTime;

            this.subscribers
                .map((handler) => handler.handleTime(newTime))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): void {
        if (state.map?.clockTime) {
            log.gsiTime.debug("map.clockTime %s", state.map.clockTime);
            this.currentTime(state.map.clockTime);
        }
    }
}
