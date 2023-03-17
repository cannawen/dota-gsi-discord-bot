import gsi = require("node-gsi");

export default abstract class GsiSubject {
    protected subscribers : any = [];

    public addObserver(newObserver: any) {
        this.subscribers.push(newObserver);
    }

    public abstract handleState(state: gsi.IDota2State | gsi.IDota2ObserverState) : void;
}
