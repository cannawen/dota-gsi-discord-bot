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
        (memo, topic) => memo && Engine.get(db, topic) !== undefined,
        true
    );
}

function hasFactChanged(db: FactStore, newFact: Fact<unknown>): boolean {
    const topic = newFact.topic;
    // Use the real db value ignoring default value to determine if the fact has changed
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
                rule.trigger.find((topic) => topic.label === changedTopic.label)
            )
            // and there none of the givens are `undefined`
            .filter((rule) => topicsAllDefined(rule.trigger, db))
            .reduce((memo, rule) => {
                const trigger = rule.trigger.map((topic) =>
                    Engine.get(db, topic)
                );
                const given = rule.given.map((topic) => Engine.get(db, topic));
                return memo.concat(rule.apply(trigger, given));
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
            // Need to set the db after checking if fact has changed
            db.set(newFact);
            const out = applyRules(db, this.rules, newFact.topic);
            out.forEach((fact) => {
                this.set(db, fact);
            });
        }
    };

    public static get<T>(db: FactStore, topic: Topic<T>): T | undefined {
        const value = db.get(topic);
        if (value === undefined) {
            return topic.defaultValue;
        } else {
            return value;
        }
    }
}

export default Engine;
