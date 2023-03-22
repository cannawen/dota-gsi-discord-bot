import { IDota2ObserverState, IDota2State } from "node-gsi";
import broker from "../broker";
import log from "../../src/log";
import Topic from "../../src/topics";

class GsiTime {
    private time: number | undefined;

    public handleState(
        state: IDota2State | IDota2ObserverState
    ): number | void {
        if (state.map?.clockTime) {
            log.debug("gsi", "map.clockTime %s", state.map.clockTime);
            const newTime = state.map.clockTime;
            if (this.time !== newTime) {
                this.time = newTime;
                return newTime;
            }
        }
    }
}

const component = new GsiTime();
broker.register(
    "GSI/TIME",
    Topic.GSI_DATA_LIVE,
    Topic.DOTA_2_TIME,
    component.handleState.bind(component)
);
broker.register(
    "GSI/TIME",
    Topic.GSI_DATA_OBSERVER,
    Topic.DOTA_2_TIME,
    component.handleState.bind(component)
);