import {
    IGsiBaseSubscriber,
} from "../events-app/IGsiConsumers";

export default class GsiHander {
    subscribers : IGsiBaseSubscriber[] = [];

    addSubscriber(newSubscriber: IGsiBaseSubscriber) {
        this.subscribers.push(newSubscriber);
    }
}
