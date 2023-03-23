import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register(
    "gsi/time",
    [topics.gsiData],
    (get) => new Fact(topics.time, get(topics.gsiData)?.time)
);
