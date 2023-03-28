import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topic from "../topic";

export default new Rule(
    rules.gsi.heroAlive,
    [topic.gsiData],
    (get) => new Fact(topic.alive, get(topic.gsiData)!.hero?.alive || false)
);
