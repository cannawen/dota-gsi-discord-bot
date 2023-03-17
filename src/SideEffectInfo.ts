export enum Type {
    AUDIO_FILE = "AUDIO_FILE",
    TTS = "TTS",
    NONE = "NONE",
}

export default class SideEffectInfo {
    type: Type;
    data: string | null;

    constructor(type: Type, data: string | null) {
        this.type = type;
        this.data = data;
    }

    static none() {
        return new SideEffectInfo(Type.NONE, null);
    }
}
