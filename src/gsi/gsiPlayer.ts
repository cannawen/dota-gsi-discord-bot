import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.player.gold, [topics.gsiData], (get) => {
    const data = get(topics.gsiData)!;
    const gold = data.player?.gold;
    return new Fact(topics.gold, gold);
});
