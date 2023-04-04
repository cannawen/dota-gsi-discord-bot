import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default [
    new Rule(
        rules.gsi.hero.alive,
        [topics.allData],
        (get) =>
            new Fact(topics.alive, get(topics.allData)!.hero?.alive || false)
    ),
    new Rule(rules.gsi.hero.buybackCost, [topics.allData], (get) => {
        const data = get(topics.allData)!;
        return new Fact(topics.buybackCost, data.hero?.buybackCost);
    }),
    new Rule(rules.gsi.hero.buybackCooldown, [topics.allData], (get) => {
        const data = get(topics.allData)!;
        return new Fact(topics.buybackCooldown, data.hero?.buybackCooldown);
    }),
];
