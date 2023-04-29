/* eslint-disable max-statements */
import Fact from "../src/engine/Fact";
import Rule from "../src/engine/Rule";
import Topic from "../src/engine/Topic";
import Engine from "../src/engine/Engine";
import FactStore from "../src/engine/FactStore";

function isAudioEffect(topic: string) {
    return (
        topic === "playPrivateAudio" ||
        topic === "playInterruptingAudioFile" ||
        topic === "playPublicAudio"
    );
}

function handleToContainTopic(actual: any, label: any) {
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
            ? () => `Topic ${label} exists. Expected to contain no such topic.`
            : () => `Topic ${label} does not exist`,
    };
}

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

    toContainAudioEffect(actual, value) {
        if (actual === undefined) {
            return {
                pass: false,
                message: () => "Did not recieve any Fact. Recieved undefined",
            };
        }
        const actualArr = Array.isArray(actual) ? actual : [actual];
        const factArray: Fact<unknown>[] = actualArr.filter(
            (fact) => fact instanceof Fact
        );
        if (factArray.length === 0) {
            return {
                pass: false,
                message: () =>
                    `Received ${JSON.stringify(
                        actual
                    )}. Expected to recieve at least one Fact objects`,
            };
        }

        const pass = factArray.reduce((memo, fact) => {
            if (value === undefined) {
                return isAudioEffect(fact.topic.label) || memo;
            } else {
                return (
                    (isAudioEffect(fact.topic.label) &&
                        this.equals(fact.value, value)) ||
                    memo
                );
            }
        }, false);
        return {
            pass,
            message: pass
                ? () => "Found audio effect topic. Expected none"
                : () =>
                      value
                          ? `Did not find audio effect topic with value ${value}. Found actual values: [${factArray
                                .filter((fact) =>
                                    isAudioEffect(fact.topic.label)
                                )
                                .map((fact) => fact.value)
                                .join(", ")}]`
                          : "Did not find any audio effect topics",
        };
    },

    toContainFact(actual, label, value) {
        if (value === undefined) {
            return handleToContainTopic(actual, label);
        }
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
        return handleToContainTopic(actual, label);
    },
});

// NOTE: Cannot re-use the existing code in PersistentFactStore
// because the import will mess with jest.mock("topicManager")
// becuase we will need to use the real topic manager
function factsToPlainObject(facts: Fact<unknown>[]) {
    return facts.reduce((memo: { [key: string]: unknown }, fact) => {
        memo[fact.topic.label] = fact.value;
        return memo;
    }, {});
}

function plainObjectToFacts(object: { [key: string]: unknown }) {
    return Object.entries(object).reduce(
        (memo: Fact<unknown>[], [topicLabel, value]) => {
            memo.push(new Fact(new Topic(topicLabel), value));
            return memo;
        },
        []
    );
}

function getResults(
    rule: Rule | Rule[],
    db: { [keys: string]: unknown },
    previousState?: Fact<unknown>[] | Fact<unknown> | undefined,
    debug?: boolean
): Fact<unknown>[] {
    const engine = new Engine();
    if (Array.isArray(rule)) {
        rule.forEach((r) => engine.register(r));
    } else {
        engine.register(rule);
    }
    const factStore = new FactStore();
    const newFacts = plainObjectToFacts(db);
    let prevStateArray: Fact<unknown>[] = [];
    if (previousState) {
        prevStateArray = Array.isArray(previousState)
            ? previousState
            : [previousState];
        removeEphemeralState(prevStateArray).forEach((fact) =>
            factStore.set(fact)
        );
    }
    newFacts.forEach((fact) => engine.set(factStore, fact));
    const result = factStore.getAllFacts();
    if (debug) {
        let message: any[] = [];
        if (previousState) {
            message.push("prevState");
            message.push(factsToPlainObject(prevStateArray));
            message.push("\n\n");
        }
        message.push("input");
        message.push(db);
        message.push("\n\n");
        if (previousState) {
            message.push("merged");
            message.push({ ...factsToPlainObject(prevStateArray), ...db });
            message.push("\n\n");
        }
        message.push("output");
        message.push(factsToPlainObject(result));

        console.log(...message);
    }
    return result;
}

function removeEphemeralState(facts: Fact<unknown>[]): Fact<unknown>[] {
    return facts
        .filter((fact) => !isAudioEffect(fact.topic.label))
        .filter((fact) => fact.topic.label !== "events");
}

global.getResults = getResults;
