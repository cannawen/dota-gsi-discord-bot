import Fact from "../engine/Fact";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.playerItems, [topics.allData], (get) => {
    const items = get(topics.allData)!.items;
    if (items) {
        return new Fact(topics.items, PlayerItems.create(items));
    } else {
        return new Fact(topics.items, undefined);
    }
});
