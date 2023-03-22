import { engine, Fact } from "../Engine";
import topics from "../topics";

engine.register({
    label: "process gsi time",
    given: [topics.gsiData],
    then: (db) => [new Fact(topics.time, db.get(topics.gsiData)?.time)],
});
