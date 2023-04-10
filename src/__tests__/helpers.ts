import Fact from "../engine/Fact";
import { factsToPlainObject } from "../engine/PersistentFactStore";
import Rule from "../engine/Rule";
import Topic from "../engine/Topic";

const makeGetFunction =
    (input: { [keys: string]: unknown }) =>
    <T>(t: Topic<T>): T =>
        input[t.label] as T;

export const getResults = (
    rule: Rule,
    db: { [keys: string]: unknown },
    previousState?: Fact<unknown>[] | Fact<unknown>
) => {
    if (previousState) {
        const arrPreviousState = Array.isArray(previousState)
            ? previousState
            : [previousState];
        return rule.then(
            makeGetFunction({ ...factsToPlainObject(arrPreviousState), ...db })
        );
    } else {
        return rule.then(makeGetFunction(db));
    }
};
