import engine from "../customEngine";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topic from "../topic";

engine.register(
    new Rule(
        "gsi/alive",
        [topic.gsiData],
        (get) => new Fact(topic.alive, get(topic.gsiData)!.hero?.alive || false)
    )
);
