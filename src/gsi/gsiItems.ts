import engine from "../customEngine";
import { Fact } from "../Engine";
import PlayerItems from "../PlayerItems";
import topics from "../topics";

engine.register("gsi/items", [topics.gsiData], (get) => {
    const items = get(topics.gsiData)?.items;
    if (items) {
        return new Fact(topics.items, PlayerItems.create(items));
    } else {
        return new Fact(topics.items, undefined);
    }
});
