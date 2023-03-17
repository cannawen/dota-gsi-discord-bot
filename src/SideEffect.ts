import SideEffectInfo, {
    Type,
} from "./SideEffectInfo";
import discord from "./discord";
import path from "node:path";

abstract class SideEffect {
    data : string | null;

    constructor(data: string | null) {
        this.data = data;
    }

    public static create(info: SideEffectInfo): SideEffect {
        switch (info.type) {
            case Type.AUDIO_FILE:
                return new SideEffectAudio(info.data);
            case Type.TTS:
                return new SideEffectTTS(info.data);
            case Type.NONE:
            default:
                return new SideEffectNone();
        }
    }

    execute() : void {}
}

class SideEffectNone extends SideEffect {
    constructor() {
        super(null);
    }
}

class SideEffectTTS extends SideEffect {
    execute(): void {
        discord.playTTS(this.data as string);
    }
}

class SideEffectAudio extends SideEffect {
    execute(): void {
        discord.playAudioFile(path.join(__dirname, "../audio/", this.data as string));
    }
}

export {
    SideEffectAudio,
    SideEffectNone,
    SideEffectTTS,
};
export default SideEffect;
