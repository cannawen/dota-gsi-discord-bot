import engine from "../customEngine";
import Fact from "../classes/engine/Fact";
import Rule from "../classes/engine/Rule";
import topic from "../topic";

engine.register(
    new Rule(
        "gsi/alive",
        [topic.gsiData],
        (get) => new Fact(topic.alive, get(topic.gsiData)!.hero?.alive || false)
    )
);
