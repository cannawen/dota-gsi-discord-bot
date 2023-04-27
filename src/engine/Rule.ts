import Fact from "./Fact";
import Topic from "./Topic";

// TODO consider changing the get function to pass back an array of given values
// so we don't need to use `get` to get our givens all the time
// would need decorators to take out the givens they secretly added under the hood
// either use var args or pass back values as an array
class Rule {
    // label is only used for logging purposes
    public readonly label: string;
    public readonly given: Topic<unknown>[];
    public readonly then: (
        get: <T>(topic: Topic<T>) => T | undefined
    ) => Fact<unknown>[] | Fact<unknown> | void;

    constructor(
        label: string,
        given: Topic<unknown>[],
        then: (
            get: <T>(topic: Topic<T>) => T | undefined
        ) => Fact<unknown>[] | Fact<unknown> | void
    ) {
        this.label = label;
        this.given = [...new Set(given)];
        this.then = then;
    }
}

export default Rule;
