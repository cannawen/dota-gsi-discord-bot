import Fact from "./Fact";
import FactStore from "./FactStore";
import Topic from "./Topic";

type getFn = <T>(topic: Topic<T>) => T | undefined;

class Rule {
    public readonly label: string;
    public readonly trigger: Topic<unknown>[];
    public readonly given: Topic<unknown>[];
    public readonly when: (trigger: any[], given: any[], get: getFn) => boolean;
    public readonly then: (
        trigger: any[],
        given: any[],
        get: getFn
    ) => Fact<unknown>[] | Fact<unknown> | void;
    public readonly defaultValues: Fact<unknown>[];

    constructor(params: {
        label: string;
        trigger?: Topic<unknown>[];
        given?: Topic<unknown>[];
        when?: (trigger: any[], given: any[], get: getFn) => boolean;
        then: (
            trigger: any[],
            given: any[],
            get: getFn
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

    public apply(trigger: any[], given: any[], get: getFn): Fact<unknown>[] {
        let facts: Fact<unknown>[] = [];
        if (this.when([...trigger], [...given], get)) {
            const out = this.then([...trigger], [...given], get);
            if (out) {
                if (Array.isArray(out)) {
                    facts = out;
                } else {
                    facts.push(out);
                }
            }
        }
        return facts;
    }
}

export default Rule;
