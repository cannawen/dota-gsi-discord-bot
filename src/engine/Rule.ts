import Fact from "./Fact";
import Topic from "./Topic";

class Rule {
    // label is only used for logging purposes
    public readonly label: string;
    public readonly given: Topic<unknown>[];
    public readonly then: (
        get: <T>(topic: Topic<T>) => T | void
    ) => Fact<unknown>[] | Fact<unknown> | void;

    constructor(
        label: string,
        given: Topic<unknown>[],
        then: (
            get: <T>(topic: Topic<T>) => T | void
        ) => Fact<unknown>[] | Fact<unknown> | void
    ) {
        this.label = label;
        this.given = [...new Set(given)];
        this.then = then;
    }
}

export default Rule;
