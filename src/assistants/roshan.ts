import topic from "../topics";
import { engine, Topic, Fact } from "../Engine";

const localTopic = {
    roshanMaybeAliveTime: new Topic<number>("roshanMaybeAliveTime"),
    roshanAliveTime: new Topic<number>("roshanAliveTime"),
};

engine.register({
    label: "assistant/roshan/killed_event/set_future_audio_state",
    given: [topic.time, topic.events],
    when: (db) => {
        const index = db
            .get(topic.events)
            ?.map((event) => event.type)
            .indexOf("roshan_killed");
        return index !== undefined && index !== -1;
    },
    then: (db) => {
        const time = db.get(topic.time);
        if (time) {
            return [
                new Fact(localTopic.roshanMaybeAliveTime, time + 8 * 60),
                new Fact(localTopic.roshanAliveTime, time + 11 * 60),
            ];
        }
    },
});

engine.register({
    label: "assistant/roshan/maybe_alive_time/play_audio",
    given: [topic.time, localTopic.roshanMaybeAliveTime],
    when: (db) =>
        db.get(topic.time) === db.get(localTopic.roshanMaybeAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "rosh-maybe.mp3")],
});

engine.register({
    label: "assistant/roshan/alive_time/play_audio",
    given: [topic.time, localTopic.roshanAliveTime],
    when: (db) => db.get(topic.time) === db.get(localTopic.roshanAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "rosh-alive.mp3")],
});

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
