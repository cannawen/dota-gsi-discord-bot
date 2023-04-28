/* eslint-disable max-statements */
import Fact from "../src/engine/Fact";
import Rule from "../src/engine/Rule";
import Topic from "../src/engine/Topic";

/* eslint-disable sort-keys */
expect.extend({
    toBeWithinRange(actual, min, max) {
        if (typeof actual !== "number") {
            throw new Error("Actual value must be a number");
        }

        const pass = actual >= min && actual <= max;

        return {
            pass,
            message: pass
                ? () =>
                      `expected ${actual} not to be within range (${min}..${max})`
                : () =>
                      `expected ${actual} to be within range (${min}..${max})`,
        };
    },

    setContaining(actual, expected) {
        if (!(actual instanceof Set)) {
            throw new Error("Actual value must be a Set");
        }

        const pass = expected.every((item) => actual.has(item));

        return {
            pass,
            message: pass
                ? () => `expected Set not to contain ${expected.join(", ")}`
                : () => `expected Set to contain ${expected.join(", ")}`,
        };
    },

    toContainFact(actual, label, value) {
        if (actual === undefined) {
            return {
                pass: false,
                message: () => "Did not recieve any Fact. Recieved undefined",
            };
        }
        const actualArr = Array.isArray(actual) ? actual : [actual];
        const factArray = actualArr.filter((fact) => fact instanceof Fact);
        if (factArray.length === 0) {
            return {
                pass: false,
                message: () =>
                    `Received ${JSON.stringify(
                        actual
                    )}. Expected to recieve at least one Fact objects`,
            };
        }

        const factsMatchingTopic = (actualArr as Fact<unknown>[]).filter(
            (f) => f.topic.label === label
        );

        let message: string;
        const factExists = factsMatchingTopic.length > 0;
        message = factExists
            ? `Fact ${label} exists `
            : `Fact ${label} does not exist `;
        const correctValue = factsMatchingTopic.reduce((memo, fact) => {
            return memo || this.equals(fact.value, value);
        }, false);
        message += correctValue
            ? `with value ${value}`
            : `with incorrect value(s) ${factsMatchingTopic
                  .map((fact) => fact.value)
                  .join(", ")} (expected ${value})`;
        const pass = factExists && correctValue;

        return {
            pass,
            message: pass
                ? () => `${message}. Expected to contain no such fact.`
                : () => `${message}`,
        };
    },

    toContainTopic(actual, label) {
        if (actual === undefined) {
            return {
                pass: false,
                message: () => "Did not recieve any Topics. Recieved undefined",
            };
        }
        const actualArr = Array.isArray(actual) ? actual : [actual];
        const factArray = actualArr.filter((fact) => fact instanceof Fact);
        if (factArray.length === 0) {
            return {
                pass: false,
                message: () => "Did not recieve any Topics. Recieved []",
            };
        }

        const fact = (actualArr as Fact<unknown>[]).find(
            (f) => f.topic.label === label
        );

        const pass = fact !== undefined;

        return {
            pass,
            message: pass
                ? () =>
                      `Topic ${label} exists. Expected to contain no such topic.`
                : () => `Topic ${label} does not exist`,
        };
    },
});

const makeGetFunction =
    (input: { [keys: string]: unknown }) =>
    <T>(t: Topic<T>): T =>
        input[t.label] as T;

// NOTE: Cannot re-use the existing code in topicManager
// because the import will mess with jest.mock("topicManager")
function factsToPlainObject(facts: Fact<unknown>[]) {
    return facts.reduce((memo: { [key: string]: unknown }, fact) => {
        memo[fact.topic.label] = fact.value;
        return memo;
    }, {});
}
// Taking a list of rules doesn't really work because our rules expect not to be run if the
function getResults(
    rule: Rule | Rule[],
    db: { [keys: string]: unknown },
    previousState?: Fact<unknown>[] | Fact<unknown> | undefined
): Fact<unknown>[] {
    if (Array.isArray(rule)) {
        const defaultFacts = rule.reduce((memo: Fact<unknown>[], r) => {
            if (r.defaultValues) {
                return [
                    ...memo,
                    ...r.defaultValues.map(
                        ([topic, value]) => new Fact(topic, value)
                    ),
                ];
            } else {
                return memo;
            }
        }, []);
        if (previousState) {
            if (Array.isArray(previousState)) {
                return rule
                    .map((r) =>
                        getSingleResults(r, db, [
                            ...defaultFacts,
                            ...previousState,
                        ])
                    )
                    .flat();
            } else {
                defaultFacts.push(previousState);
                return rule
                    .map((r) => getSingleResults(r, db, defaultFacts))
                    .flat();
            }
        } else {
            return rule
                .map((r) => getSingleResults(r, db, defaultFacts))
                .flat();
        }
    } else {
        return getSingleResults(rule, db, previousState);
    }
}

// TODO refactor to be in function() format
const getSingleResults = (
    rule: Rule,
    db: { [keys: string]: unknown },
    previousState?: Fact<unknown>[] | Fact<unknown> | undefined
): Fact<unknown>[] => {
    let allState: { [keys: string]: unknown } = {};
    if (rule.defaultValues) {
        const defaultEntries = rule.defaultValues.map(([topic, value]) => [
            topic.label,
            value,
        ]);
        allState = Object.fromEntries(defaultEntries);
    }
    let out: Fact<unknown>[] = [];

    if (previousState) {
        const arrPreviousState = Array.isArray(previousState)
            ? previousState
            : [previousState];
        allState = {
            ...allState,
            ...factsToPlainObject(arrPreviousState),
            ...db,
        };
    } else {
        allState = { ...allState, ...db };
    }

    const getFn = makeGetFunction(allState);
    const givenValues = rule.given.map((topic) => allState[topic.label]);
    if (rule.when(givenValues, getFn)) {
        const actionResult = rule.action(givenValues, getFn);
        if (actionResult) {
            if (Array.isArray(actionResult)) {
                out = actionResult;
            } else {
                out.push(actionResult);
            }
        }
    }
    const thenResult = rule.then(makeGetFunction(allState));
    if (thenResult) {
        if (Array.isArray(thenResult)) {
            out = [...out, ...thenResult];
        } else {
            out.push(thenResult);
        }
    }

    return out;
};

global.getResults = getResults as any;
