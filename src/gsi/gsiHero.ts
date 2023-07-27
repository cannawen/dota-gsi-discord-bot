import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.gsi.hero,
    trigger: [topics.allData],
    then: ([data]) => {
        const hero = (data as GsiData).hero;
        if (hero) {
            return [
                new Fact(topics.alive, hero.alive || false),
                new Fact(topics.buybackCost, hero.buybackCost),
                new Fact(topics.buybackCooldown, hero.buybackCooldown),
                new Fact(topics.hero, hero.name),
                new Fact(topics.level, hero.level),
                new Fact(topics.respawnSeconds, hero.respawnSeconds),
            ];
        }
    },
});
