import gsi = require("node-gsi");
import log from "../log";

export default abstract class GsiSubject {
    protected observers : any = [];

    public addObserver(newObserver: any) {
        log.gsi.debug("%s registering new observer %s", this, newObserver);
        this.observers.push(newObserver);
    }

    public abstract handleState(state: gsi.IDota2State | gsi.IDota2ObserverState) : void;
}
