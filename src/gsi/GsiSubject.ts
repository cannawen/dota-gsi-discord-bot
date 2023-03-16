import {
    IGsiBaseObserver,
} from "../plugins/IGsiObservers";
import gsi = require("node-gsi");

export default abstract class GsiSubject {
    protected subscribers : IGsiBaseObserver[] = [];

    public addObserver(newObserver: IGsiBaseObserver) {
        this.subscribers.push(newObserver);
    }

    public abstract handleState(state: gsi.IDota2State | gsi.IDota2ObserverState) : void;
}
