import GsiSubject from "./GsiSubject";
import {
    IGsiTimeObserver,
} from "../events-app/IGsiObservers";
import SideEffect from "../SideEffect";

export default class GsiTimeSubject extends GsiSubject {
    protected subscribers : IGsiTimeObserver[] = [];
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
