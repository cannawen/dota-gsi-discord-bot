import colors from "@colors/colors";
import deepEqual from "deep-equal";
import log from "./log";

// in topics.js
export class Topic<Type> {
    label: string;
    private _type: Type | undefined;

    constructor(label: string) {
        this.label = label;
    }
}

export class Fact<Type> {
    topic: Topic<Type>;
    value: Type | null;

    constructor(topic: Topic<Type>, value: Type) {
        this.topic = topic;
        this.value = value;
    }
}

// engine

const doesIntersect = <T>(set: Set<T>, arr: Array<T>): boolean => {
    // eslint-disable-next-line no-loops/no-loops
    for (const item of arr) {
        if (set.has(item)) {
            return true;
        }
    }
    return false;
};

class FactStore {
    facts = new Map<Topic<any>, Fact<any>>();

    get = <T>(topic: Topic<T>): T => {
        return this.facts.get(topic)?.value;
    };

    set = (fact: Fact<any>) => {
        this.facts.set(fact.topic, fact);
    };
}
type getFn = <T>(topic: Topic<T>) => T;

type Rule = {
    label: string;
    given: Array<Topic<any>>;
    then: (get: getFn) => Fact<any>[] | Fact<any> | void;
};

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

export abstract class Engine {
    protected rules: Rule[] = [];
    protected db = new FactStore();

    public register = (
        label: string,
        given: Array<Topic<any>>,
        then: (get: getFn) => Fact<any>[] | Fact<any> | void
    ) => {
        const rule = {
            label: label,
            given: given,
            then: then,
        };
        log.info("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    protected set = (...changes: Fact<any>[]) => {
        const changedKeys = new Set<Topic<any>>();
        changes.forEach((newFact) => {
            const newTopic = newFact.topic;

            const oldValue = this.db.get(newTopic);
            const newValue = newFact.value;

            if (!deepEqual(oldValue, newValue)) {
                if ("gsiData" !== newTopic.label) {
                    log.verbose(
                        "rules",
                        "%s : %s -> %s",
                        log.padToWithColor(newTopic.label.green, 15, true),
                        log.padToWithColor(
                            removeLineBreaks(colors.gray(oldValue)),
                            15,
                            false
                        ),
                        removeLineBreaks(colors.green(newValue))
                    );
                }
                changedKeys.add(newTopic);
                this.db.set(newFact);
            }
        });
        this.next(changedKeys);
    };

    private next = (changedKeys: Set<Topic<any>>) => {
        this.rules.forEach((rule) => {
            if (doesIntersect(changedKeys, rule.given)) {
                const out = rule.then((topic) => this.db.get(topic));
                if (!out) {
                    return;
                }
                const arrOut = Array.isArray(out) ? out : [out];
                log.debug("rules", "Start rule\t%s", rule.label.yellow);
                this.set(...arrOut);
                log.debug("rules", "End rule  \t%s", rule.label);
            }
        });
    };
}

export default Engine;
