import glue from "../../glue";
import {
    PlayerItems,
} from "../../gsi/GsiItems";
import Topic from "../../Topics";

export default class TrustyShovelPlugin {
    private currentTime: number | undefined;
    private shovelCanBeUsed: boolean | undefined;
    private lastShovelReminderTime = 0;

    constructor() {
        glue.register(Topic.DOTA_2_ITEMS, null, this.items);
        glue.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_TTS, this.handleTime);
    }

    handleTime(time: number) : string | void {
        this.currentTime = time;
        if (this.shovelCanBeUsed && this.currentTime - this.lastShovelReminderTime >= 15) {
            this.lastShovelReminderTime = this.currentTime;
            return "dig";
        }
    }

    items(items: PlayerItems): void {
        if (items.neutral?.id === "item_trusty_shovel") {
            this.shovelCanBeUsed = items.neutral.cooldown === undefined || items.neutral.cooldown === 0;
        }
    }
}
