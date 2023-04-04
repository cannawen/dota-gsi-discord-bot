import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.gsi.heroAlive,
    [topics.allData],
    (get) => new Fact(topics.alive, get(topics.allData)!.hero?.alive || false)
);
