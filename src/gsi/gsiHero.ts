import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.hero, [topics.allData], (get) => {
    const hero = get(topics.allData)!.hero;
    if (hero) {
        return [
            new Fact(topics.alive, hero.alive || false),
            new Fact(topics.buybackCost, hero.buybackCost),
            new Fact(topics.buybackCooldown, hero.buybackCooldown),
            new Fact(topics.respawnSeconds, hero.respawnSeconds),
        ];
    }
});
