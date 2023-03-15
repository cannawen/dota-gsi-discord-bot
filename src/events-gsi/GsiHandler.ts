import {
    IGsiBaseSubscriber,
} from "../events-app/IGsiConsumers";

export default class GsiHander {
    protected subscribers : IGsiBaseSubscriber[] = [];

    public addSubscriber(newSubscriber: IGsiBaseSubscriber) {
        this.subscribers.push(newSubscriber);
    }
}
