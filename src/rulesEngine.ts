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

const topic = {
    time: new Topic<number>("time"),
    event_message: new Topic<string>("event_message"),
    playAudioFile: new Topic<string>("playAudioFile"),
};

// engine

const doesIntersect = <T>(set: Set<T>, arr: Array<T>): boolean => {
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

class Engine {
    rules: Rule[] = [];
    db = new FactStore();

    public register = (rule: Rule) => {
        log.info("rules", "Registering new rule %s", rule.label.yellow);
        this.rules.push(rule);
    };

    public set = (changes: Fact<any>[] | void) => {
        if (changes) {
            const changedKeys = new Set<Topic<any>>();
            changes.forEach((newFact) => {
                const topic = newFact.topic;

                const oldValue = this.db.get(topic);
                const newValue = newFact.value;

                if (oldValue !== newValue) {
                    log.debug(
                        "rules",
                        "%s : %s -> %s",
                        log.padToWithColor(topic.label.green, 15, true),
                        log.padToWithColor(colors.gray(oldValue), 15, true),
                        colors.green(newValue)
                    );
                    changedKeys.add(topic);
                    this.db.set(newFact);
                }
            });
            this.next(changedKeys);
        }
    };

    private next = (changedKeys: Set<Topic<any>>) => {
        this.rules.forEach((rule) => {
            if (doesIntersect(changedKeys, rule.given)) {
                if (!rule.when || rule.when(this.db)) {
                    log.debug("rules", "Start rule\t%s", rule.label.yellow);
                    this.set(rule.then(this.db));
                    log.debug("rules", "End rule  \t%s", rule.label);
                }
            }
        });
    };
}

export default Engine;

const engine = new Engine();

/// using it

// in roshan.js

const localTopic = {
    roshanMaybeAliveTime: new Topic<number>("roshanMaybeAliveTime"),
    roshanAliveTime: new Topic<number>("roshanAliveTime"),
};

engine.register({
    label: "assistant/roshan/killed_event/set_future_audio_state",
    given: [topic.time, topic.event_message],
    when: (db) => db.get(topic.event_message) === "roshan_killed",
    then: (db) => [
        new Fact(localTopic.roshanMaybeAliveTime, db.get(topic.time) + 8 * 60),
        new Fact(localTopic.roshanAliveTime, db.get(topic.time) + 11 * 60),
    ],
});

engine.register({
    label: "assistant/roshan/maybe_alive_time/play_audio",
    given: [topic.time, localTopic.roshanMaybeAliveTime],
    when: (db) =>
        db.get(topic.time) === db.get(localTopic.roshanMaybeAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "roshan_maybe.wav")],
});

engine.register({
    label: "assistant/roshan/alive_time/play_audio",
    given: [topic.time, localTopic.roshanAliveTime],
    when: (db) => db.get(topic.time) === db.get(localTopic.roshanAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "roshan_alive.wav")],
});

// in audio.js
const playAudio = (f: string) => console.log("PLAY", f);

engine.register({
    label: "playAudio",
    given: [topic.playAudioFile],
    then: (db) => {
        const f = db.get(topic.playAudioFile);
        if (f) {
            playAudio(f);
            //TODO need to reset audio to null so we can play the same audio twice in a row
        }
    },
});

// in GSI
engine.set([
    new Fact(topic.time, 123),
    new Fact(topic.event_message, "roshan_killed"),
]);
engine.set([new Fact(topic.time, 124), new Fact(topic.event_message, null)]);
engine.set([new Fact(topic.time, 603), new Fact(topic.event_message, null)]);
engine.set([new Fact(topic.time, 604), new Fact(topic.event_message, null)]);
engine.set([new Fact(topic.time, 783), new Fact(topic.event_message, null)]);
