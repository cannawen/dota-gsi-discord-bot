import Fact from "./Fact";
import Topic from "./Topic";

class Rule {
    public readonly label: string;
    public readonly trigger: Topic<unknown>[];
    public readonly given: Topic<unknown>[];
    /**
     * TODO trigger and given are passed based on order which is kinda sketchy
     */
    public readonly when: (trigger: any[], given: any[]) => boolean;
    public readonly then: (
        trigger: any[],
        given: any[]
    ) => Fact<unknown>[] | Fact<unknown> | void;

    constructor(params: {
        label: string;
        trigger?: Topic<unknown>[];
        given?: Topic<unknown>[];
        when?: (trigger: any[], given: any[]) => boolean;
        then: (
            trigger: any[],
            given: any[]
        ) => Fact<unknown>[] | Fact<unknown> | void;
    }) {
        this.label = params.label;
        this.trigger = params.trigger || [];
        this.given = params.given || [];
        this.when = params.when || (() => true);
        this.then = params.then;
    }

    // TODO test
    public apply(trigger: any[], given: any[]): Fact<unknown>[] {
        if (this.when([...trigger], [...given])) {
            return this.thenArray([...trigger], [...given]);
        }
        return [];
    }

    // TODO test
    /**
     * Helper that turns output facts into an array of facts
     * Instead of `Fact<unknown>[] | Fact<unknown> | void`
     */
    public thenArray(trigger: any[], given: any[]): Fact<unknown>[] {
        const out = this.then([...trigger], [...given]);
        if (Array.isArray(out)) {
            return out;
        }
        if (out instanceof Fact) {
            return [out];
        }
        return [];
    }
}

export default Rule;
