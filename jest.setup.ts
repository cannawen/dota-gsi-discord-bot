/* eslint-disable max-statements */
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

    toContainFact(actual, label, value) {
        if (actual === undefined) {
            throw new Error("Received undefined instead of Fact");
        }
        const actualArr = Array.isArray(actual) ? actual : [actual];
        const factArray = actualArr.filter((fact) => fact instanceof Fact);
        if (factArray.length === 0) {
            throw new Error(
                `Received ${actual}. Expected to recieve at least one Fact objects (Currently not handling Promise<Fact>).`
            );
        }

        const fact = (actualArr as Fact<unknown>[]).find(
            (f) => f.topic.label === label
        );

        let message: string;
        const factExists = fact !== undefined;
        message = factExists
            ? `Fact ${label} exists `
            : `Fact ${label} does not exist `;
        const correctValue = fact?.value === value;
        message += correctValue
            ? `with value ${value}`
            : `with incorrect value ${fact?.value} (expected ${value})`;
        const pass = factExists && correctValue;

        return {
            pass,
            message: pass
                ? () => `${message}. Expected to contain no such fact.`
                : () => `${message}`,
        };
    },
});
