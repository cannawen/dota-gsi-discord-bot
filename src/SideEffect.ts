import announce from "./announce";
import path from "node:path";

// Abstract class? Interface? We never want to instantiate SideEffect
// but we want to make sure all child SideEffects have an .execute
abstract class SideEffect {
    execute() : void {}
}

class SideEffectNone extends SideEffect {}

class SideEffectAudio extends SideEffect {
    filename: string;

    constructor(filename: string) {
        super();
        this.filename = filename;
    }

    execute(): void {
        announce(path.join(__dirname, "../audio/", this.filename));
    }
}

export {
    SideEffectAudio,
    SideEffectNone,
    SideEffect,
};
