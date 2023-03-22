import engine from "../CustomEngine";
import { Fact } from "../Engine";
import PlayerItems from "../PlayerItems";
import topics from "../topics";

engine.register("gsi/items", [topics.gsiData], (get) => {
    const gsiItems = get(topics.gsiData).items;
    if (gsiItems) {
        return [new Fact(topics.items, PlayerItems.create(gsiItems))];
    } else {
        return [new Fact(topics.items, undefined)];
    }
});
