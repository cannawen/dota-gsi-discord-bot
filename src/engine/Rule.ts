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
    /**
     * TODO Do we want defaultValues as part of a rule, or as part of a separate mechanism?
     * This seems a bit dangerous because any rule can set a default value for any topic
     * And it won't be clear where our defaults are coming from.
     */
    public readonly defaultValues: Fact<unknown>[];

    constructor(params: {
        label: string;
        trigger?: Topic<unknown>[];
        given?: Topic<unknown>[];
        when?: (trigger: any[], given: any[]) => boolean;
        then: (
            trigger: any[],
            given: any[]
        ) => Fact<unknown>[] | Fact<unknown> | void;
        defaultValues?: Fact<unknown>[];
    }) {
        this.label = params.label;
        this.trigger = params.trigger || [];
        this.given = params.given || [];
        this.when = params.when || (() => true);
        this.then = params.then;
        this.defaultValues = params.defaultValues || [];
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
