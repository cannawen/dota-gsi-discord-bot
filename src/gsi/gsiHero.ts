import engine from "../customEngine";
import { Fact } from "../Engine";
import topic from "../topic";

engine.register(
    "gsi/alive",
    [topic.gsiData],
    (get) => new Fact(topic.alive, get(topic.gsiData)!.hero?.alive || false)
);
