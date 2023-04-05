import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.player, [topics.allData], (get) => {
    const player = get(topics.allData)!.player;
    return new Fact(topics.gold, player?.gold);
});
