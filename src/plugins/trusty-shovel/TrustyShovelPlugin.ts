import {
    IGsiItemsObserver, IGsiTimeObserver,
} from "../../IGsiObservers";
import SideEffectInfo, {
    Type,
} from "../../SideEffectInfo";
import {
    PlayerItems,
} from "../../gsi/GsiItemsSubject";

export default class TrustyShovelPlugin implements IGsiItemsObserver, IGsiTimeObserver {
    private currentTime: number | undefined;
    private shovelCanBeUsed: boolean | undefined;
    private lastShovelReminderTime = 0;

    handleTime(time: number) : SideEffectInfo | void {
        this.currentTime = time;
        if (this.shovelCanBeUsed && this.currentTime - this.lastShovelReminderTime >= 15) {
            this.lastShovelReminderTime = this.currentTime;
            return new SideEffectInfo(Type.TTS, "dig");
        }
    }

    items(items: PlayerItems): void {
        if (items.neutral?.id === "item_trusty_shovel") {
            this.shovelCanBeUsed = items.neutral.cooldown === undefined || items.neutral.cooldown === 0;
        }
    }
}
