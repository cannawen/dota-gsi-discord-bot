import { engine, Fact } from "../Engine";
import topics from "../topics";

engine.register("gsi/time", [topics.gsiData], (db) => [
    new Fact(topics.time, db.get(topics.gsiData)?.time),
]);
