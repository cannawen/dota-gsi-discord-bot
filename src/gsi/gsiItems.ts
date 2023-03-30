import Fact from "../engine/Fact";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.playerItems, [topics.gsi.allData], (get) => {
    const items = get(topics.gsi.allData)?.items;
    if (items) {
        return new Fact(topics.gsi.items, PlayerItems.create(items));
    } else {
        return new Fact(topics.gsi.items, undefined);
    }
});
