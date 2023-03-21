import Event from "./Event";
import gsi from "node-gsi";
import PlayerItems from "./PlayerItems";

export class Topic<Type> {
    label: string;
    private data: Type | null;

    constructor(label: string) {
        this.label = label;
        this.data = null;
    }
}

export default {
    // TODO split up observer and regular state
    GSI_DATA_LIVE: new Topic<gsi.IDota2State>("GSI_DATA_LIVE"),
    GSI_DATA_OBSERVER: new Topic<gsi.IDota2ObserverState>("GSI_DATA_OBSERVER"),
    DOTA_2_TIME: new Topic<number>("DOTA_2_TIME"),
    DOTA_2_ITEMS: new Topic<PlayerItems>("DOTA_2_ITEMS"),
    DOTA_2_EVENTS: new Topic<Event[]>("DOTA_2_EVENTS"),
    DOTA_2_GAME_STATE: new Topic<boolean>("DOTA_2_GAME_STATE"),
    EFFECT_PLAY_TTS: new Topic<string>("EFFECT_PLAY_TTS"),
    EFFECT_PLAY_FILE: new Topic<string>("EFFECT_PLAY_FILE"),
};
