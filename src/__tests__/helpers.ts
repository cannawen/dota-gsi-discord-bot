import Rule from "../engine/Rule";
import Topic from "../engine/Topic";

const getFn =
    (input: { [keys: string]: unknown }) =>
    <T>(t: Topic<T>): T =>
        input[t.label] as T;

export const getResults = (rule: Rule, db: { [keys: string]: unknown }) =>
    rule.then(getFn(db));
