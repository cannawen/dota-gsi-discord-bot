import EffectType from "./EffectType";

export default class EffectInfo {
    type: EffectType;
    data: string;

    private constructor(type: EffectType, data: string) {
        this.type = type;
        this.data = data;
    }

    static createTTS(message: string) {
        return new EffectInfo(EffectType.TTS, message);
    }

    static createAudioFile(audioFile: string) {
        return new EffectInfo(EffectType.AUDIO_FILE, audioFile);
    }
}
