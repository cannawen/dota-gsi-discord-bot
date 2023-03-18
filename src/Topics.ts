import gsi = require("node-gsi");

export enum Type {
    GSI_DATA,
    DOTA_2_TIME,
    DOTA_2_ITEMS,
    DOTA_2_EVENTS,
    DOTA_2_GAME_STATE,
    EFFECT_PLAY_TTS,
    EFFECT_PLAY_FILE,
}

class Topic<T> {
    private type: Type;

    constructor(type: Type) {
        this.type = type;
    }
}

export default Topic;
