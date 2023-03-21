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
    roshanIsMaybeBackAnnounceTime: new Topic<number>(
        "roshanIsMaybeBackAnnounceTime"
    ),
    roshanIsBackAnnounceTime: new Topic<number>("roshanIsBackAnnounceTime"),
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
    given: Array<Topic<any>>;
    when?: (db: FactStore) => boolean;
    then: (db: FactStore) => Fact<any>[] | void;
};

class Engine {
    rules: Rule[] = [];
    db = new FactStore();

    public registerRule = (rule: Rule) => {
        this.rules.push(rule);
    };

    public set = (changes: Fact<any>[] | void) => {
        console.log("set", changes);
        if (changes) {
            const changedKeys = new Set<Topic<any>>();
            changes.forEach((fact) => {
                if (this.db.get(fact.topic) !== fact.value) {
                    changedKeys.add(fact.topic);
                    this.db.set(fact);
                }
            });
            this.next(changedKeys);
        }
    };

    private next = (changedKeys: Set<Topic<any>>) => {
        console.log("next");
        this.rules.forEach((rule) => {
            if (doesIntersect(changedKeys, rule.given)) {
                if (!rule.when || rule.when(this.db)) {
                    this.set(rule.then(this.db));
                }
            }
        });
    };
}

const engine = new Engine();

/// using it

// in roshan.js
engine.registerRule({
    given: [topic.time, topic.event_message],
    when: (db) => db.get(topic.event_message) === "roshan_killed",
    then: (db) => [
        new Fact(
            topic.roshanIsMaybeBackAnnounceTime,
            db.get(topic.time) + 8 * 60
        ),
        new Fact(topic.roshanIsBackAnnounceTime, db.get(topic.time) + 11 * 60),
    ],
});

engine.registerRule({
    given: [topic.time, topic.roshanIsMaybeBackAnnounceTime],
    when: (db) =>
        db.get(topic.time) === db.get(topic.roshanIsMaybeBackAnnounceTime),
    then: (_) => [new Fact(topic.playAudioFile, "roshan_maybe_alive.wav")],
});

engine.registerRule({
    given: [topic.time, topic.roshanIsBackAnnounceTime],
    when: (db) => db.get(topic.time) === db.get(topic.roshanIsBackAnnounceTime),
    then: (_) => [new Fact(topic.playAudioFile, "roshan_alive.wav")],
});

// in audio.js
const playAudio = (f: string) => console.log("PLAY", f);

engine.registerRule({
    given: [topic.playAudioFile],
    then: (db) => {
        const f = db.get(topic.playAudioFile);
        if (f) {
            playAudio(f);
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
