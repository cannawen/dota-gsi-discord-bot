import deepEqual from "deep-equal";
import Fact from "./src/engine/Fact";

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

    toBeFact(actual, label, value) {
        if (!(actual instanceof Fact)) {
            throw new Error("Actual value must be a Fact");
        }
        const pass =
            actual.topic.label === label && deepEqual(actual.value, value);

        return {
            pass,
            message: pass
                ? () => `expected Fact ${label} not to contain ${value}`
                : () => `expected Fact ${label} to contain ${value}`,
        };
    },
});
