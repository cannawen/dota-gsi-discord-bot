import GsiHander from "./GsiHandler";
import {
    IGsiTimeSubscriber,
} from "../events-app/IGsiConsumers";
import SideEffect from "../SideEffect";

export default class GsiTimeHandler extends GsiHander {
    protected subscribers : IGsiTimeSubscriber[] = [];
    private time: number | undefined;

    public currentTime(newTime: number) {
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
