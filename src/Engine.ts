/* eslint-disable max-classes-per-file */
import colors from "@colors/colors";
import deepEqual from "deep-equal";
import log from "./log";

/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */
export class Topic<Type> {
    public label: string;
    // The following variable is not used, but is only here for type-checking reasons
    private _type: Type | undefined;

    public constructor(label: string) {
        this.label = label;
    }
}

/**
 * A `Fact` describes a topic and value (i.e. Time is the number 5)
 */
export class Fact<Type> {
    public topic: Topic<Type>;
    public value: Type | null;

    public constructor(topic: Topic<Type>, value: Type) {
        this.topic = topic;
        this.value = value;
    }
}

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

    get = <T>(topic: Topic<T>): T => this.facts.get(topic)?.value;

    set = (fact: Fact<any>) => {
        this.facts.set(fact.topic, fact);
    };
}

type dbGetFn = <T>(topic: Topic<T>) => T;

type Rule = {
    // label is only used for logging purposes
    label: string;
    given: Array<Topic<any>>;
    then: (get: dbGetFn) => Fact<any>[] | Fact<any> | void;
};

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

export class Engine {
    private rules: Rule[] = [];
    private db = new FactStore();

    public register = (
        label: string,
        given: Array<Topic<any>>,
        then: (get: dbGetFn) => Fact<any>[] | Fact<any> | void
    ) => {
        const rule = {
            label: label,
            given: given,
            then: then,
        };
        log.info("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    // Currently only way to set on this database is to create a custom subclass
    // This is because our app's only dynamic input is from GSI data
    // and any other database change must be triggered by that.
    // This will change in the future from discord interactions
    protected set = (...newFacts: Fact<any>[]) => {
        const changedTopics = new Set<Topic<any>>();
        newFacts.forEach((newFact) => {
            const newTopic = newFact.topic;

            const oldValue = this.db.get(newTopic);
            const newValue = newFact.value;

            if (!deepEqual(oldValue, newValue)) {
                // Do not print out GSI data because it's too large
                if (newTopic.label !== "gsiData") {
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
                changedTopics.add(newTopic);
                this.db.set(newFact);
            }
        });

        this.rules.forEach((rule) => {
            // If a topic that a rule is interested in has changed
            if (doesIntersect(changedTopics, rule.given)) {
                // Process the rule
                const out = rule.then((topic) => this.db.get(topic));
                if (!out) {
                    return;
                }
                // Process any database changes as a result of this rule being applied
                const arrOut = Array.isArray(out) ? out : [out];
                log.debug("rules", "Start rule\t%s", rule.label.yellow);
                this.set(...arrOut);
                log.debug("rules", "End rule  \t%s", rule.label);
            }
        });
    };
}

export default Engine;
