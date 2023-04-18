import Fact from "./Fact";
import Topic from "./Topic";

// TODO consider: now you can set fact on engine willy-nilly,
// is it still worth to be able to return a promise of a fact from the rule engine?
// How to reconcile there are two ways to set facts now?
class Rule {
    // label is only used for logging purposes
    public readonly label: string;
    public readonly given: Array<Topic<unknown>>;
    public readonly then: (
        get: <T>(topic: Topic<T>) => T | undefined
    ) =>
        | Fact<unknown>
        | Promise<Fact<unknown>>
        | void
        | Array<Fact<unknown> | Promise<Fact<unknown> | void>>;

    constructor(
        label: string,
        given: Array<Topic<unknown>>,
        then: (
            get: <T>(topic: Topic<T>) => T | undefined
        ) =>
            | Fact<unknown>
            | Promise<Fact<unknown>>
            | void
            | Array<Fact<unknown> | Promise<Fact<unknown> | void>>
    ) {
        this.label = label;
        this.given = given;
        this.then = then;
    }
}

export default Rule;
