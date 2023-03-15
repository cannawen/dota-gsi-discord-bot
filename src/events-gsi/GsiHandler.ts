import {
    IGsiBaseSubscriber,
} from "../events-app/IGsiSubscribers";

export default class GsiHander {
    protected subscribers : IGsiBaseSubscriber[] = [];

    public addSubscriber(newSubscriber: IGsiBaseSubscriber) {
        this.subscribers.push(newSubscriber);
    }
}
