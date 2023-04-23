import Fact from "../src/engine/Fact";
import { MatcherFunction } from "expect";
import Rule from "../src/engine/Rule";

declare global {
    function getResults(
        rule: Rule,
        db: { [keys: string]: unknown },
        previousState?: Fact<unknown>[] | Fact<unknown>
    ): Fact<unknown>[] | Fact<unknown>;

    namespace jest {
        interface Matchers<R, T> {
            toBeWithinRange(min: number, max: number): R;
            setContaining(expected: T extends Set<infer V> ? V[] : never): R;
            toContainFact(label: string, value: unknown): R;
            toContainTopic(label: string): R;
        }

        interface Expect {
            setContaining<T>(expected: T[]): Set<T>;
        }

        interface ExpectExtendMap {
            toBeWithinRange: MatcherFunction<[min: number, max: number]>;
            setContaining: MatcherFunction<[unknown[]]>;
            toContainFact: MatcherFunction<[label: string, value: unknown]>;
            toContainTopic: MatcherFunction<[label: string]>;
        }
    }
}

export {};
