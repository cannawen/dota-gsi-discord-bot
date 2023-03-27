import Fact from "./Fact";
import Topic from "./Topic";

class Rule {
    // label is only used for logging purposes
    label: string;
    given: Array<Topic<unknown>>;
    then: (
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
