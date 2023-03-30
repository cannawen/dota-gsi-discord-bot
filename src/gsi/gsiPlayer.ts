import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.player.gold, [topics.gsi.allData], (get) => {
    const data = get(topics.gsi.allData)!;
    const gold = data.player?.gold;
    return new Fact(topics.gsi.gold, gold);
});
