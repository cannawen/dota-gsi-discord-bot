import engine from "../customEngine";
import Fact from "../classes/engine/Fact";
import PlayerItems from "../classes/data/PlayerItems";
import Rule from "../classes/engine/Rule";
import topic from "../topic";

engine.register(
    new Rule("gsi/items", [topic.gsiData], (get) => {
        const items = get(topic.gsiData)?.items;
        if (items) {
            return new Fact(topic.items, PlayerItems.create(items));
        } else {
            return new Fact(topic.items, undefined);
        }
    })
);
