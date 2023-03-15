import GsiHander from "./GsiHandler";
import {
    IGsiTimeSubscriber,
} from "../events-app/IGsiConsumers";
import SideEffect from "../SideEffect";

export default class GsiTimeHandler extends GsiHander {
    subscribers : IGsiTimeSubscriber[] = [];
    time: number | undefined;

    currentTime(newTime: number) {
        if (this.time !== newTime) {
            this.time = newTime;

            this.subscribers
                .map((handler) => handler.handleTime(newTime))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }
}
