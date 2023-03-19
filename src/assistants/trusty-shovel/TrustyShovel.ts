import broker from "../../broker";
import {
    PlayerItems,
} from "../../gsi/GsiItems";
import Topic from "../../Topic";

export default class TrustyShovel {
    private currentTime: number | undefined;
    private shovelCanBeUsed: boolean | undefined;
    private lastShovelReminderTime = 0;

    public handleTime(time: number) : string | void {
        this.currentTime = time;
        if (this.shovelCanBeUsed && this.currentTime - this.lastShovelReminderTime >= 15) {
            this.lastShovelReminderTime = this.currentTime;
            return "dig";
        }
    }

    public items(items: PlayerItems): void {
        if (items.neutral?.id === "item_trusty_shovel") {
            this.shovelCanBeUsed = items.neutral.cooldown === undefined || items.neutral.cooldown === 0;
        }
    }
}

const component = new TrustyShovel();
broker.register(Topic.DOTA_2_ITEMS, null, component.items.bind(component));
broker.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_TTS, component.handleTime.bind(component));
