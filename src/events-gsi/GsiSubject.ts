import {
    IGsiBaseObserver,
} from "../events-app/IGsiObservers";

export default class GsiSubject {
    protected subscribers : IGsiBaseObserver[] = [];

    public addObserver(newObserver: IGsiBaseObserver) {
        this.subscribers.push(newObserver);
    }
}
