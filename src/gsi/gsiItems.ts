import Fact from "../engine/Fact";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topic from "../topic";

export default new Rule(rules.gsi.playerItems, [topic.gsiData], (get) => {
    const items = get(topic.gsiData)?.items;
    if (items) {
        return new Fact(topic.items, PlayerItems.create(items));
    } else {
        return new Fact(topic.items, undefined);
    }
});
