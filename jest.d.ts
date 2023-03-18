import {
    MatcherFunction,
} from "expect";

type OwnMatcher<Params extends unknown[]> = (
  this: jest.MatcherContext,
  actual: unknown,
  ...params: Params
) => jest.CustomMatcherResult

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeWithinRange(min: number, max: number): R;
      setContaining(expected: T extends Set<infer V> ? V[] : never): R;
      toBeAudio(fileName: string): R;
    }

    interface Expect {
      setContaining<T>(expected: T[]): Set<T>;
    }

    interface ExpectExtendMap {
      toBeAudio: MatcherFunction<[fileName: string]>;
      toBeWithinRange: OwnMatcher<[min: number, max: number]>;
      setContaining: MatcherFunction<[unknown[]]>;
    }
  }
}

export {};
