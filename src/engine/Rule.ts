import Fact from "./Fact";
import Topic from "./Topic";

type getFn = <T>(topic: Topic<T>) => T | undefined;

// TODO have Rule take keys { label: string, given: [], when: () => boolean, then: () => Fact<unknown>[]}
class Rule {
    // label is only used for logging purposes
    public readonly label: string;
    public readonly given: Topic<unknown>[];
    public readonly then: (
        get: getFn
    ) => Fact<unknown>[] | Fact<unknown> | void;
    public readonly when: (values: any[], get: getFn) => boolean;
    public readonly action: (
        values: any[],
        get: getFn
    ) => Fact<unknown>[] | Fact<unknown> | void;
    public readonly defaultValues: [Topic<unknown>, unknown][] | undefined;
    public readonly defaultValuesMap: Map<Topic<unknown>, unknown>;

    // eslint-disable-next-line max-params
    constructor(
        label: string,
        given: Topic<unknown>[],
        then: (get: getFn) => Fact<unknown>[] | Fact<unknown> | void,
        when?: (values: any[], get: getFn) => boolean,
        action?: (
            values: any[],
            get: getFn
        ) => Fact<unknown>[] | Fact<unknown> | void,
        defaultValues?: [Topic<unknown>, unknown][]
    ) {
        this.label = label;
        this.given = given;
        this.then = then;
        this.when = when || (() => false);
        this.action = action || (() => {});
        this.defaultValues = defaultValues;
        this.defaultValuesMap = new Map(defaultValues);
    }
}

export default Rule;
