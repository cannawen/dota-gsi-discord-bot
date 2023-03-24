import engine from "../customEngine";
import { Fact } from "../Engine";
import topic from "../topic";

engine.register(
    "gsi/time",
    [topic.gsiData],
    (get) => new Fact(topic.time, get(topic.gsiData)?.time)
);
