import EffectInfo from "../../EffectInfo";
import GsiItemsObserver from "../../gsi/GsiItemsObserver";
import GsiTimeObserver from "../../gsi/GsiTimeObserver";
import {
    PlayerItems,
} from "../../gsi/GsiItems";

export default class TrustyShovelPlugin implements GsiItemsObserver, GsiTimeObserver {
    private currentTime: number | undefined;
    private shovelCanBeUsed: boolean | undefined;
    private lastShovelReminderTime = 0;

    handleTime(time: number) : EffectInfo | void {
        this.currentTime = time;
        if (this.shovelCanBeUsed && this.currentTime - this.lastShovelReminderTime >= 15) {
            this.lastShovelReminderTime = this.currentTime;
            return EffectInfo.createTTS("dig");
        }
    }

    items(items: PlayerItems): void {
        if (items.neutral?.id === "item_trusty_shovel") {
            this.shovelCanBeUsed = items.neutral.cooldown === undefined || items.neutral.cooldown === 0;
        }
    }
}
