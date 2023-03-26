/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */
import colors from "@colors/colors";
import deepEqual from "deep-equal";
import Fact from "./Fact";
import log from "../../log";
import Topic from "./Topic";

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
        if (fact && fact.value !== undefined) {
            // Casting to T is safe here because when it is set,
            // The fact's topic is used as a key
            return fact.value as T;
        } else {
            log.debug("rules", "No value for fact %s", topic.label.yellow);
            return undefined;
        }
    };

    public set = (fact: Fact<unknown>) => {
        this.facts.set(fact.topic, fact);
    };
}

type getFn = <T>(topic: Topic<T>) => T | undefined;

type Rule = {
    // label is only used for logging purposes
    label: string;
    given: Array<Topic<unknown>>;
    then: (
        get: getFn
    ) =>
        | Fact<unknown>
        | Promise<Fact<unknown>>
        | void
        | Array<Fact<unknown> | Promise<Fact<unknown> | void>>;
};

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

const topicsAllDefined = (topics: Topic<unknown>[], db: FactStore): boolean =>
    topics.reduce((memo, topic) => memo && db.get(topic) !== undefined, true);

class Engine {
    private rules: Rule[] = [];
    protected db = new FactStore();

    public register = (
        label: Rule["label"],
        given: Rule["given"],
        then: Rule["then"]
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
    protected set = (newFact: Fact<unknown>) => {
        const changedTopics = new Set<Topic<unknown>>();

        const topic = newFact.topic;
        const oldValue = this.db.get(topic);
        const newValue = newFact.value;

        if (!deepEqual(oldValue, newValue)) {
            // Do not print out GSI data because it's too large
            if (topic.label !== "gsiData") {
                log.verbose(
                    "rules",
                    "%s : %s -> %s",
                    log.padToWithColor(topic.label.green, 15, true),
                    log.padToWithColor(
                        // TODO: Weird cast to pass into colors
                        removeLineBreaks(colors.gray(oldValue as any)),
                        15,
                        false
                    ),
                    removeLineBreaks(colors.green(newValue as string))
                );
            }
            changedTopics.add(topic);
            this.db.set(newFact);
        }

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
                arrOut.forEach((factOrFactPromise) => {
                    if (factOrFactPromise instanceof Promise) {
                        factOrFactPromise.then((fact) => {
                            if (fact) {
                                this.set(fact);
                            }
                        });
                    } else {
                        this.set(factOrFactPromise);
                    }
                });
                log.debug("rules", "End rule  \t%s", rule.label);
            }
        });
    };
}

export default Engine;
