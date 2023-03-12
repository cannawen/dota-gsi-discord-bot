import announce from "../announce";
import path from "node:path";

class SideEffect {
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
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
