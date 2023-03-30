import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.gsi.heroAlive,
    [topics.gsi.allData],
    (get) =>
        new Fact(
            topics.gsi.alive,
            get(topics.gsi.allData)!.hero?.alive || false
        )
);
