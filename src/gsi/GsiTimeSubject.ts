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
    protected observers : IGsiTimeObserver[] = [];
    private time: number | undefined;

    private currentTime(newTime: number) {
        if (this.time !== newTime) {
            this.time = newTime;

            this.observers.map((observer) => observer.handleTime(newTime)) // notify all observers about time
                .map((info) => SideEffect.create(info)) // create a side effect from the side effect info
                .map((sideEffect) => sideEffect.execute()); // execute that side effect - this doesn't belong here
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): void {
        if (state.map?.clockTime) {
            log.gsiTime.debug("map.clockTime %s", state.map.clockTime);
            this.currentTime(state.map.clockTime);
        }
    }
}
