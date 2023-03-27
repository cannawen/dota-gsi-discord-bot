import engine from "../customEngine";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topic from "../topic";

engine.register(
    new Rule(
        "gsi/time",
        [topic.gsiData],
        (get) => new Fact(topic.time, get(topic.gsiData)?.time)
    )
);
