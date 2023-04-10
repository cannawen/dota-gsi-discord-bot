/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */
import colors from "@colors/colors";
import deepEqual from "deep-equal";
import Fact from "./Fact";
import FactStore from "./FactStore";
import log from "../log";
import Rule from "./Rule";
import Topic from "./Topic";

function doesIntersect<T>(set: Set<T>, arr: Array<T>): boolean {
    // eslint-disable-next-line no-loops/no-loops
    for (const item of arr) {
        if (set.has(item)) {
            return true;
        }
    }
    return false;
}

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

function topicsAllDefined(topics: Topic<unknown>[], db: FactStore): boolean {
    return topics.reduce(
        (memo, topic) => memo && db.get(topic) !== undefined,
        true
    );
}

class Engine {
    private rules: Rule[] = [];
    private factQueue: {
        db: FactStore;
        fact: Fact<unknown> | Promise<Fact<unknown> | void>;
    }[] = [];

    public register = (rule: Rule) => {
        log.verbose("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    /**
     * Currently only way to set on this database is to create a custom subclass
     * @param db
     * @param newFact
     */
    protected set = (db: FactStore, newFact: Fact<unknown>) => {
        const changedTopics = new Set<Topic<unknown>>();

        const topic = newFact.topic;
        const oldValue = db.get(topic);
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
            db.set(newFact);
        }

        this.rules.forEach((rule) => {
            // If a topic that a rule is interested in has changed
            // and there none of the givens are `undefined`
            // Note: anyone can still `set` a fact to be undefined,
            // But it will not be propogated downstream
            // Note: this is why it is safe to do a !
            // when we get any topics from the db if they are in the given array
            if (
                doesIntersect(changedTopics, rule.given) &&
                topicsAllDefined(rule.given, db)
            ) {
                // Process the rule
                const out = rule.then((topic) => db.get(topic));
                if (!out) {
                    return;
                }

                // Enqueue any database changes as a result of this rule being applied
                const arrOut = Array.isArray(out) ? out : [out];
                arrOut.forEach((fact) => {
                    this.factQueue.push({ db: db, fact: fact });
                });

                // eslint-disable-next-line no-loops/no-loops
                while (this.factQueue.length > 0) {
                    log.debug("rules", "Start rule\t%s", rule.label.yellow);

                    const queueElement = this.factQueue.splice(0, 1)[0];
                    const factOrFactPromise = queueElement.fact;

                    if (factOrFactPromise instanceof Promise) {
                        // Is a promise of a fact (or undefined), set fact when promise is returned
                        factOrFactPromise.then((fact) => {
                            if (fact) {
                                this.set(db, fact);
                            }
                        });
                    } else {
                        // Is a fact, set fact now
                        this.set(db, factOrFactPromise);
                    }

                    log.debug("rules", "End rule  \t%s", rule.label);
                }
            }
        });
    };
}

export default Engine;
