import discord from "./discord";
import path from "node:path";

enum Type {
    AUDIO_FILE = "AUDIO_FILE",
    TTS = "TTS",
    NONE = "NONE",
}

// Abstract class? Interface? We never want to instantiate SideEffect
// but we want to make sure all child SideEffects have an .execute
abstract class SideEffect {
    type : Type = Type.NONE;
    data? : string;

    constructor(type: Type, data: any) {
        this.type = type;
        this.data = data;
    }

    execute() : void {}
}

function create(type: Type, data: any) {
    switch (type) {
    case Type.AUDIO_FILE:
        return new SideEffectAudio(data);
    case Type.TTS:
        return new SideEffectTTS(data);
    case Type.NONE:
    default:
        return new SideEffectNone();
    }
}

class SideEffectNone extends SideEffect {
    constructor() {
        super(Type.NONE, undefined);
    }
}

class SideEffectTTS extends SideEffect {
    constructor(audioResource: string) {
        super(Type.TTS, audioResource);
    }

    execute(): void {
        discord.playTTS(this.data as string);
    }
}

class SideEffectAudio extends SideEffect {
    constructor(audioResource: string) {
        super(Type.AUDIO_FILE, audioResource);
    }

    execute(): void {
        discord.playAudioFile(path.join(__dirname, "../audio/", this.data as string));
    }
}

export default {
    create,
    Type,
};
