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
    public value: Type;

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
    private facts = new Map<Topic<unknown>, Fact<unknown>>();

    public get = <T>(topic: Topic<T>): T | undefined => {
        const fact = this.facts.get(topic);
        if (fact) {
            // Casting to T is safe here because when it is set,
            // The fact's topic is used as a key
            return fact.value as T;
        } else {
            return undefined;
        }
    };

    public set = (fact: Fact<unknown>) => {
        this.facts.set(fact.topic, fact);
    };
}

type dbGetFn = <T>(topic: Topic<T>) => T;

type Rule = {
    // label is only used for logging purposes
    label: string;
    given: Array<Topic<unknown>>;
    then: (get: dbGetFn) => Fact<unknown>[] | Fact<unknown> | void;
};

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

const topicsAllDefined = (topics: Topic<unknown>[], db: FactStore): boolean =>
    topics.reduce((memo, topic) => memo && db.get(topic) !== undefined, true);

export class Engine {
    private rules: Rule[] = [];
    private db = new FactStore();

    public register = (
        label: string,
        given: Array<Topic<unknown>>,
        then: (get: dbGetFn) => Fact<unknown>[] | Fact<unknown> | void
    ) => {
        const rule = {
            label: label,
            // eslint-disable-next-line sort-keys
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
    protected set = (...newFacts: Fact<unknown>[]) => {
        const changedTopics = new Set<Topic<unknown>>();
        newFacts.forEach((newFact) => {
            const newTopic = newFact.topic;
            const oldValue = this.db.get(newTopic);
            const newValue = newFact.value;

            if (!deepEqual(oldValue, newValue)) {
                // Do not print out GSI data because it's too large
                if (newTopic.label !== "gsiData") {
                    // TODO: Casting to string here is pretty sus - what do?
                    log.verbose(
                        "rules",
                        "%s : %s -> %s",
                        log.padToWithColor(newTopic.label.green, 15, true),
                        log.padToWithColor(
                            removeLineBreaks(colors.gray(oldValue as string)),
                            15,
                            false
                        ),
                        removeLineBreaks(colors.green(newValue as string))
                    );
                }
                changedTopics.add(newTopic);
                this.db.set(newFact);
            }
        });

        this.rules.forEach((rule) => {
            // If a topic that a rule is interested in has changed
            // and there none of the givens are `undefined`
            // Note: anyone can still `set` a fact to be undefined,
            // But it will not be propogated downstream
            if (
                doesIntersect(changedTopics, rule.given) &&
                topicsAllDefined(rule.given, this.db)
            ) {
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
