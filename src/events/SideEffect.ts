import announce from "../announce";
import path from "node:path";

// Abstract class? Interface? We never want to instantiate SideEffect
// but we want to make sure all child SideEffects have an .execute
class SideEffect {
    execute() : void {}
}

class None extends SideEffect {}

class Audio extends SideEffect {
    filename: string;

    constructor(filename: string) {
        super();
        this.filename = filename;
    }

    execute(): void {
        announce(path.join(__dirname, "../../audio/", this.filename));
    }
}

export default {
    Audio,
    None,
    SideEffect,
};
