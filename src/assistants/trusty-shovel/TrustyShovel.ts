import broker from "../../broker";
import PlayerItems from "../../PlayerItems";
import Topic from "../../Topic";

export default class TrustyShovel {
    private shovelCanBeUsed: boolean | undefined;
    private lastShovelReminderTime = 0;

    public handleTime(time: number) : string | void {
        if (this.shovelCanBeUsed && time - this.lastShovelReminderTime >= 15) {
            this.lastShovelReminderTime = time;
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
broker.register("ASSISTANT/TRUSTY_SHOVEL/ITEMS", Topic.DOTA_2_ITEMS, null, component.items.bind(component));
broker.register("ASSISTANT/TRUSTY_SHOVEL/TIME", Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_TTS, component.handleTime.bind(component));
