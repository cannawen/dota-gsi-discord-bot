import appHandler from "../events-app/allAppHandlers";
import {
    IGsiTimeConsumer,
} from "../events-app/IGsiConsumers";
import SideEffect from "../SideEffect";

const interestedHandlers: IGsiTimeConsumer[] = [
    appHandler.roshan,
    appHandler.runes,
    // appHandler.stack, // disabled stack timer for now
];

export default class GsiTimeHandler {
    time: number | undefined;

    currentTime(newTime: number) {
        if (this.time !== newTime) {
            this.time = newTime;

            interestedHandlers
                .map((handler) => handler.handleTime(newTime))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }
}
