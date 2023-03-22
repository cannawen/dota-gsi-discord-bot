import log from "./log";
import colors from "@colors/colors";

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

type Rule = {
    label: string;
    given: Array<Topic<any>>;
    when?: (db: FactStore) => boolean;
    then: (db: FactStore) => Fact<any>[] | void;
};

function removeLineBreaks(s: string) {
    return s.replace(/(\r\n|\n|\r)/gm, "");
}

class Engine {
    rules: Rule[] = [];
    db = new FactStore();

    public register = (rule: Rule) => {
        log.info("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    public set = (...changes: Fact<any>[]) => {
        const changedKeys = new Set<Topic<any>>();
        changes.forEach((newFact) => {
            const newTopic = newFact.topic;

            const oldValue = this.db.get(newTopic);
            const newValue = newFact.value;

            if (oldValue !== newValue) {
                // <--- TODO deep equal
                log.debug(
                    "rules",
                    "%s : %s -> %s",
                    log.padToWithColor(newTopic.label.green, 15, true),
                    removeLineBreaks(
                        log.padToWithColor(colors.gray(oldValue), 15, true)
                    ),
                    removeLineBreaks(
                        log.padToWithColor(colors.green(newValue), 15, true)
                    )
                );
                changedKeys.add(newTopic);
                this.db.set(newFact);
            }
        });
        this.next(changedKeys);
    };

    private next = (changedKeys: Set<Topic<any>>) => {
        this.rules.forEach((rule) => {
            if (doesIntersect(changedKeys, rule.given)) {
                if (!rule.when || rule.when(this.db)) {
                    log.debug("rules", "Start rule\t%s", rule.label.yellow);
                    const out = rule.then(this.db);
                    if (out) {
                        this.set(...out);
                    }
                    log.debug("rules", "End rule  \t%s", rule.label);
                }
            }
        });
    };
}

export const engine = new Engine();

/// using it

// in roshan.js

// // in audio.js
//

// // in GSI
// engine.set([
//     new Fact(topic.time, 123),
//     new Fact(topic.event_message, "roshan_killed"),
// ]);
// engine.set([new Fact(topic.time, 124), new Fact(topic.event_message, null)]);
// engine.set([new Fact(topic.time, 603), new Fact(topic.event_message, null)]);
// engine.set([new Fact(topic.time, 604), new Fact(topic.event_message, null)]);
// engine.set([new Fact(topic.time, 783), new Fact(topic.event_message, null)]);