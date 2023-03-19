import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import glue from "../glue";
import log from "../log";
import Topic from "../Topics";

export default class GsiTime {
    private time: number | undefined;

    constructor() {
        glue.register(Topic.GSI_DATA, Topic.DOTA_2_TIME, this.handleState);
    }

    public handleState(state: IDota2State | IDota2ObserverState): number | void {
        if (state.map?.clockTime) {
            log.gsiTime.debug("map.clockTime %s", state.map.clockTime);
            const newTime = state.map.clockTime;
            if (this.time !== newTime) {
                this.time = newTime;
                return newTime;
            }
        }
    }
}
