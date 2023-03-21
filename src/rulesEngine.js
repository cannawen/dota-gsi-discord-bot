const doesIntersect = (set, arr) => {
    for (const item of arr) {
        if (set.has(item)) {
            return true;
        }
    }
    return false;
};

class Engine {
    rules = [];
    db = {};

    registerRule = (rule) => {
        this.rules.push(rule);
    };

    set = (changes) => {
        console.log("set", changes);
        if (changes) {
            const changedKeys = new Set();
            Object.keys(changes).forEach((k) => {
                if (this.db[k] !== changes[k]) {
                    changedKeys.add(k);
                    this.db[k] = changes[k];
                }
            });
            this.next(changedKeys);
        }
    };
    // private
    next = (changedKeys) => {
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
    given: ["time", "event_message"],
    when: ({ event_message }) => event_message === "roshan_killed",
    then: ({ time }) => ({
        roshanIsMaybeBackAnnounceTime: time + 8 * 60,
        roshanIsBackAnnounceTime: time + 11 * 60,
    }),
});

// in roshan.js
engine.registerRule({
    given: ["time", "roshanIsMaybeBackAnnounceTime"],
    when: ({ time, roshanIsMaybeBackAnnounceTime }) =>
        time === roshanIsMaybeBackAnnounceTime,
    then: (_) => ({
        playAudioFile: "roshan_maybe_alive.wav",
    }),
});

// in roshan.js
engine.registerRule({
    given: ["time", "roshanIsBackAnnounceTime"],
    when: ({ time, roshanIsBackAnnounceTime }) =>
        time === roshanIsBackAnnounceTime,
    then: (_) => ({
        playAudioFile: "roshan_alive.wav",
    }),
});

const playAudio = (f) => console.log("PLAY", f);

// in audio.js
engine.registerRule({
    given: ["playAudioFile"],
    then: (db) => {
        playAudio(db.playAudioFile);
    },
});

engine.set({ time: 123, event_message: "roshan_killed" });
engine.set({ time: 124, event_message: null });
engine.set({ time: 603, event_message: null });
engine.set({ time: 604, event_message: null });
engine.set({ time: 783, event_message: null });
