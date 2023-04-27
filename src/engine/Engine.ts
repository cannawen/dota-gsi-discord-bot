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

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

function topicsAllDefined(topics: Topic<unknown>[], db: FactStore): boolean {
    return topics.reduce(
        (memo, topic) => memo && db.get(topic) !== undefined,
        true
    );
}

function hasFactChanged(db: FactStore, newFact: Fact<unknown>): boolean {
    const topic = newFact.topic;
    const oldValue = db.get(topic);
    const newValue = newFact.value;

    if (!deepEqual(oldValue, newValue, { strict: true })) {
        // Do not print out GSI data because it's too large
        if (topic.label !== "allData") {
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
        return true;
    }
    return false;
}

/**
 * Notifies all rules of changedTopic and returns new facts from all rules
 */
function applyRules(
    db: FactStore,
    rules: Rule[],
    changedTopic: Topic<unknown>
): Fact<unknown>[] {
    return (
        rules
            // If the rule is interested in this changed topic
            .filter((rule) =>
                rule.given.find((topic) => topic.label === changedTopic.label)
            )
            .map((rule) => {
                rule.given.map((topic) => {
                    const value = db.get(topic);
                    if (value === undefined) {
                        db.set(new Fact(topic, rule.defaultValues?.get(topic)));
                    }
                });
                return rule;
            })
            // and there none of the givens are `undefined`
            .filter((rule) => topicsAllDefined(rule.given, db))
            .reduce((memo, rule) => {
                let returnMemo: Fact<unknown>[] = [];

                const params = rule.given.map((topic) => db.get(topic));

                if (rule.when && rule.when(params)) {
                    if (rule.action) {
                        const action = rule.action(params);
                        if (action) {
                            if (Array.isArray(action)) {
                                returnMemo = memo.concat(action);
                            } else {
                                returnMemo.push(action);
                            }
                        }
                    }
                }

                // Process the rule
                const out = rule.then((topic) => db.get(topic));
                if (out) {
                    // Collect any database changes as a result of this rule being applied
                    if (Array.isArray(out)) {
                        returnMemo = memo.concat(out);
                    } else {
                        returnMemo.push(out);
                    }
                }
                return returnMemo;
            }, [] as Fact<unknown>[])
    );
}

class Engine {
    private rules: Rule[] = [];

    public register = (rule: Rule) => {
        log.verbose("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    public set = (db: FactStore, newFact: Fact<unknown>) => {
        if (hasFactChanged(db, newFact)) {
            db.set(newFact);
            const newFacts = applyRules(db, this.rules, newFact.topic);
            newFacts.forEach((fact) => {
                this.set(db, fact);
            });
        }
    };
}

export default Engine;
