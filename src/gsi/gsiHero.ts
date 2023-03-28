import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.gsi.heroAlive,
    [topics.gsiData],
    (get) => new Fact(topics.alive, get(topics.gsiData)!.hero?.alive || false)
);
