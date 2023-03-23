import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register(
    "gsi/alive",
    [topics.gsiData],
    (get) => new Fact(topics.alive, get(topics.gsiData).hero?.alive)
);
