import discord from "./discord";
import path from "node:path";

// Abstract class? Interface? We never want to instantiate SideEffect
// but we want to make sure all child SideEffects have an .execute
abstract class SideEffect {
    execute() : void {}
}

class SideEffectNone extends SideEffect {}

class SideEffectTTS extends SideEffect {
    audioResource: string;

    constructor(audioResource: string) {
        super();
        this.audioResource = audioResource;
    }

    execute(): void {
        discord.playAudio(this.audioResource);
    }
}

class SideEffectAudio extends SideEffect {
    audioResource: string;

    constructor(audioResource: string) {
        super();
        this.audioResource = audioResource;
    }

    execute(): void {
        discord.playAudio(path.join(__dirname, "../audio/", this.audioResource));
    }
}

export {
    SideEffectAudio,
    SideEffectTTS,
    SideEffectNone,
    SideEffect,
};
