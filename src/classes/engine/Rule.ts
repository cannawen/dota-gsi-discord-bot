import Fact from "./Fact";
import Topic from "./Topic";

type Rule = {
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
};

export default Rule;
