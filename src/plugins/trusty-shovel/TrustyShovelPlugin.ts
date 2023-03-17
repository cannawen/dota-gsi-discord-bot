import {
    IGsiItemsObserver, IGsiTimeObserver,
} from "../../IGsiObservers";
import {
    PlayerItems,
} from "../../gsi/GsiItemsSubject";
import SideEffectInfo from "../../SideEffectInfo";

export default class TrustyShovelPlugin implements IGsiItemsObserver, IGsiTimeObserver {
    private currentTime: number | undefined;
    private shovelOnCooldown: boolean | undefined;
    private lastShovelReminderTime: number | undefined;

    handleTime(time: number) : SideEffectInfo | void {
    }

    items(items: PlayerItems): void {
        if (items.neutral?.id === "item_trusty_shovel") {

        }
    }
}
